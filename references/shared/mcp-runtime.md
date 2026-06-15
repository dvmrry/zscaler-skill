---
product: shared
topic: "mcp-runtime"
title: "Zscaler MCP Server — runtime, toolsets, and automation boundaries"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
verified-against:
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
sources:
  - "vendor/zscaler-mcp-server/pyproject.toml"
  - "vendor/zscaler-mcp-server/README.md"
  - "vendor/zscaler-mcp-server/CHANGELOG.md"
  - "vendor/zscaler-mcp-server/CLAUDE.md"
  - "vendor/zscaler-mcp-server/zscaler_mcp/server.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/services.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/common/tool_helpers.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/common/toolsets.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/common/entitlements.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
author-status: draft
---

# Zscaler MCP Server — runtime, toolsets, and automation boundaries

This reference captures behavior of the vendored Zscaler MCP server itself. It
is not a substitute for product Help/API docs: use it to answer "what can the
automation server expose, hide, or mutate?" and then corroborate product
semantics in the product reference when the claim is about Zscaler behavior
rather than the MCP runtime.

As of the vendored checkout, the package version is `0.12.7`
(`vendor/zscaler-mcp-server/pyproject.toml:1-3`).

## Authentication boundary

The current MCP runtime uses the unified Zscaler SDK client and no longer
supports legacy per-service authentication. Legacy per-service clients,
credential blocks, and the `use_legacy` tool parameter were removed; MCP users
must supply OneAPI/ZIdentity credentials such as `ZSCALER_CLIENT_ID`,
`ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY`,
`ZSCALER_VANITY_DOMAIN`, and `ZSCALER_CUSTOMER_ID` where ZPA tools require it
(`vendor/zscaler-mcp-server/CHANGELOG.md:165`).

This is a runtime boundary, not a statement that every product has lost its
legacy public API path. For product/API-auth guidance, keep using
[`./oneapi.md`](./oneapi.md) and product-specific references.

## Runtime safety model

Read-only mode is the default. The README states that read tools are registered
by default, while create/update/delete tools are disabled unless write mode is
explicitly enabled (`vendor/zscaler-mcp-server/README.md:88-112`).

Write tools require two gates:

1. `--enable-write-tools` or `ZSCALER_MCP_WRITE_ENABLED=true`
2. A non-empty `--write-tools` / `ZSCALER_MCP_WRITE_TOOLS` allowlist

If write mode is enabled without an allowlist, zero write tools are registered
(`vendor/zscaler-mcp-server/README.md:114-183`;
`vendor/zscaler-mcp-server/zscaler_mcp/common/tool_helpers.py:247-303`).
The helper layer applies the same registration filters to read and write tools:
`disabled_tools` first, then active toolset selection, then `enabled_tools`;
write tools then apply the explicit `write_tools` allowlist
(`vendor/zscaler-mcp-server/zscaler_mcp/common/tool_helpers.py:193-230`,
`:314-330`).

Delete operations have an extra server-side confirmation token in addition to
the agent permission prompt. The README describes this as HMAC-SHA256,
single-use, and time-limited (`vendor/zscaler-mcp-server/README.md:206-223`).

## Discovery flow

The server always registers five meta tools:

| Tool | Purpose |
|---|---|
| `zscaler_check_connectivity` | API connectivity check |
| `zscaler_get_available_services` | Service-level loaded/disabled/entitlement overview |
| `zscaler_list_toolsets` | Primary toolset discovery entry point |
| `zscaler_get_toolset_tools` | Drill into one toolset and see availability |
| `zscaler_enable_toolset` | Runtime-enable a not-yet-loaded toolset |

Source: `vendor/zscaler-mcp-server/zscaler_mcp/server.py:817-889`.

The intended agent flow is:

1. Call `zscaler_list_toolsets` first.
2. Treat `can_enable: false` as authoritative, especially for entitlement
   failures.
3. Call `zscaler_get_toolset_tools` for the candidate toolset.
4. Treat `available: false` as authoritative instead of retrying hidden tools.
5. Use `zscaler_enable_toolset` only when the toolset can be enabled in this
   session.

The server docstrings encode that exact flow and returned field names
(`vendor/zscaler-mcp-server/zscaler_mcp/server.py:1028-1170`,
`:1216-1265`).

## Toolsets and entitlement filtering

Toolsets are first-class metadata records with `id`, `service`, `description`,
`default`, and optional per-toolset instructions. The service code is used by
the entitlement filter, so a tool mapped to the wrong toolset can be hidden or
exposed under the wrong product boundary
(`vendor/zscaler-mcp-server/zscaler_mcp/common/toolsets.py:75-108`).

The selected toolsets are resolved in three layers:

- explicit `--toolsets` / `ZSCALER_MCP_TOOLSETS`, with `default` and `all`
  keywords;
- otherwise, every toolset whose owning service is enabled;
- the `meta` toolset is always preserved
  (`vendor/zscaler-mcp-server/zscaler_mcp/server.py:605-634`).

After selection, the OneAPI entitlement filter decodes the bearer token's
`service-info[].prd` values and maps product codes such as `ZIA`, `ZPA`, `ZDX`,
`ZCC`, `ZTW`, `ZEASM`, `ZINS`, and `ZMS` to internal service codes
(`vendor/zscaler-mcp-server/zscaler_mcp/common/entitlements.py:1-13`,
`:68-86`). The filter is cache-first and non-fatal; missing credentials,
network errors, decode failures, or missing `service-info` leave the selected
toolsets unchanged (`vendor/zscaler-mcp-server/zscaler_mcp/common/entitlements.py:15-34`,
`:250-295`).

## Observed v0.12.7 inventory

Static inspection of `services.py` in the vendored checkout found 382 service
tools plus the five meta tools.

| Service | Read | Write | Notes |
|---|---:|---:|---|
| ZIA | 84 | 82 | Largest tool surface; rule families plus singleton settings |
| ZPA | 53 | 56 | App segments, policy, connectors, service edges, LSS reads |
| ZDX | 27 | 4 | Read-heavy; deeptrace/analysis lifecycle has writes |
| ZTW | 13 | 6 | Cloud/Branch Connector-style inventory plus IP group writes |
| ZMS | 20 | 0 | Read-only GraphQL query surface |
| ZINS | 16 | 0 | Analytics-only GraphQL-derived tools |
| ZID | 10 | 0 | ZIdentity read tools |
| ZEASM | 7 | 0 | EASM read tools |
| ZCC | 4 | 0 | Devices, trusted networks, forwarding profiles, OTP bundle |

Representative source anchors: ZCC read tools at
`vendor/zscaler-mcp-server/zscaler_mcp/services.py:74-97`, ZDX tools at
`:160-319`, ZTW tools at `:2323-2424`, EASM tools at `:2539-2599`, ZINS tools
at `:2676-2814`, and ZMS tools at `:2835-3082`.

## Product surfaces newly exposed by MCP

These are automation surfaces observed in the MCP server. Treat them as MCP
coverage until the relevant product reference corroborates official API
semantics.

| Area | MCP evidence | Reference target |
|---|---|---|
| ZIA ATP policy, security exceptions, malicious URL denylist | New ATP tools in changelog; implementation is PUT-replace for settings and exceptions, add/delete for malicious URLs (`vendor/zscaler-mcp-server/CHANGELOG.md:141`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/atp_settings.py:1-33`, `:151-236`, `:262-330`) | [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md) |
| ZIA malware-protection singletons | Four singleton blocks with strict update contracts and protocol refetch workaround (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/atp_malware_protection.py:1-40`, `:215-248`, `:343-430`) | [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md) |
| ZIA Advanced Settings singleton | GET/update surface with PUT-replace behavior; omitted fields reset to defaults or empty lists (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/advanced_settings.py:1-28`, `:43-150`) | [`../zia/sdk.md`](../zia/sdk.md) |
| ZIA Cloud App Control authoring | `rule_type` is required; action vocabulary is category-level but create validates per app/action tuple; one rule per app is safest for multi-app requests (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py:1-137`, `:225-315`, `:750-770`) | [`../zia/cloud-app-control.md`](../zia/cloud-app-control.md) |
| ZIA Time Intervals | Time intervals use minute-of-day fields, day tokens, letters/spaces-only names, and backfilled PUT updates; MCP states SSL Inspection rules do not support `time_windows` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/time_intervals.py:1-37`, `:48-76`, `:281-354`) | [`../zia/time-intervals.md`](../zia/time-intervals.md) |
| ZPA individual Service Edges | Separate from Service Edge Groups and provisioning keys; list/get expose runtime state, status, version, location, enrollment cert, parent group; delete requires reprovisioning (`vendor/zscaler-mcp-server/CHANGELOG.md:117`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zpa/service_edges.py:13-96`, `:104-225`) | [`../zpa/private-service-edges.md`](../zpa/private-service-edges.md) |
| ZPA LSS config audit | Read-only config/catalog tools only; no log streaming or querying through MCP (`vendor/zscaler-mcp-server/CHANGELOG.md:147`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zpa/lss.py:1-21`, `:35-215`) | [`../zpa/log-receivers.md`](../zpa/log-receivers.md) |
| ZDX toolset split and diagnostics | Five ZDX toolsets; deeptrace/analysis lifecycle is the only write surface (`vendor/zscaler-mcp-server/CHANGELOG.md:143`; `vendor/zscaler-mcp-server/zscaler_mcp/common/toolsets.py:891-964`; `vendor/zscaler-mcp-server/zscaler_mcp/services.py:160-319`) | [`../zdx/api.md`](../zdx/api.md) |
| ZCC OTP bundle | One `zcc_get_device_otp` call returns the full sensitive OTP bundle, not only logout OTP (`vendor/zscaler-mcp-server/CHANGELOG.md:135`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zcc/get_otp.py:1-19`, `:57-125`) | [`../zcc/api.md`](../zcc/api.md) |
| ZMS GraphQL read surface | MCP exposes read-only GraphQL tools for agents, resources, policy rules, app zones, app catalog, nonces, and tags (`vendor/zscaler-mcp-server/zscaler_mcp/services.py:2835-3082`) | [`../zms/index.md`](../zms/index.md) |
| EASM | MCP exposes organizations, findings, evidence, scan output, and lookalike domains as read-only tools (`vendor/zscaler-mcp-server/zscaler_mcp/services.py:2539-2599`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md:419-431`) | new EASM reference when product sources are corroborated |

## Runtime/deployment additions

Recent vendor releases added operational packaging and deployment behavior that
belongs with MCP runtime docs, not product feature docs:

- `zscaler-mcp update` checks GitHub Releases with PyPI fallback and can apply
  an in-place package upgrade outside containers; inside containers it refuses
  and points operators at image-pull workflow
  (`vendor/zscaler-mcp-server/CHANGELOG.md:3-13`).
- Release builds now publish immutable and rolling semver Docker tags, not only
  `latest` (`vendor/zscaler-mcp-server/CHANGELOG.md:13`).
- Signed MCPB bundles are attached to releases with detached signature and
  SHA-256 checksum (`vendor/zscaler-mcp-server/CHANGELOG.md:23-33`).
- Helm chart deployment and an interactive deployer were added under
  `integrations/helm-chart/` (`vendor/zscaler-mcp-server/CHANGELOG.md:41-43`).
- Strands AgentCore client support and streamable-HTTP handshake handling were
  added for AWS Bedrock AgentCore deployments
  (`vendor/zscaler-mcp-server/CHANGELOG.md:51-69`).
- HTTP transport hardening normalizes trailing slashes and legacy
  `application/json-rpc` content type before auth/source-IP middleware
  (`vendor/zscaler-mcp-server/CHANGELOG.md:109-113`).
- Lifecycle commands `reload`, `restart`, `status`, and `stop` manage PID
  files, SIGHUP reloads, SIGUSR2 restarts, and SIGTERM stops
  (`vendor/zscaler-mcp-server/CHANGELOG.md:119`).

## Drift and known risks

### Toolset counts in docs are stale

`README.md` still points to "29 toolsets" in the toolset section
(`vendor/zscaler-mcp-server/README.md:225-247`), while `CLAUDE.md` says 52
toolsets and 21 ZIA sub-toolsets (`vendor/zscaler-mcp-server/CLAUDE.md:92-100`).
Static catalog inspection in `toolsets.py` found 53 toolsets, including the
new `zia_threat_settings` toolset for mobile advanced threat settings
(`vendor/zscaler-mcp-server/zscaler_mcp/common/toolsets.py:495-517`).

### ZTW and ZINS tools can be routed into ZIA toolsets

The source comments say all `ztw_*` tools should collapse into the `ztw`
toolset (`vendor/zscaler-mcp-server/zscaler_mcp/common/toolsets.py:1218-1224`),
but the first-match prefix rules run broad ZIA predicates before the final
`ztw_` catch-all. In particular, `_location`, `_network_service`, and IP
source/destination group predicates map matching names into `zia_locations` or
`zia_cloud_firewall` before `n.startswith("ztw_")` can fire
(`vendor/zscaler-mcp-server/zscaler_mcp/common/toolsets.py:1297-1307`,
`:1360-1364`).

Generated supported-tool docs show the consequence: several ZTW IP group and
network service tools are listed under `zia_cloud_firewall`, and several ZINS
location/firewall analytics tools are listed under `zia_locations` or
`zia_cloud_firewall`
(`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:372-397`,
`:435-455`).

Because entitlement filtering works at the mapped toolset service boundary,
this is not just cosmetic. A misrouted ZTW or ZINS tool may be exposed or hidden
according to ZIA entitlement/toolset selection rather than the intended
product's entitlement.

### ZDX deeptrace spelling drift

The service registry uses `zdx_start_deeptrace` and `zdx_delete_deeptrace`
(`vendor/zscaler-mcp-server/zscaler_mcp/services.py:298-307`), while
`CLAUDE.md` still mentions `zdx_start_deep_trace`
(`vendor/zscaler-mcp-server/CLAUDE.md:111-114`). Prefer the service registry
spelling when documenting callable tool names.

## Open questions

- Confirm product-level API semantics for ZIA ATP/malware/advanced settings
  against official API/SDK docs before treating MCP implementation details as
  product contract.
- Verify whether the ZTW/ZINS toolset-routing issue is fixed upstream before
  relying on toolset selection or entitlement behavior for those products.
- Build a generated inventory artifact from `services.py` and `toolsets.py` so
  future MCP upgrades can be diffed without hand-counting.
