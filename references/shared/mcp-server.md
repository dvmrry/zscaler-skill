---
product: shared
topic: "mcp-server"
title: "Zscaler MCP server — transport hardening, write gating, and inventory"
content-type: reference
last-verified: "2026-07-22"
verified-against:
  vendor/zscaler-mcp-server: 47fe874551023bf8d138c24612aa4ea0f16aaa56
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-mcp-server/pyproject.toml"
  - "vendor/zscaler-mcp-server/CHANGELOG.md"
  - "vendor/zscaler-mcp-server/README.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/server.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py"
  - "vendor/zscaler-mcp-server/tests/test_cli.py"
  - "vendor/zscaler-mcp-server/tests/test_registry.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/zscaler-mcp-server/requirements.txt"
  - "vendor/zscaler-mcp-server/uv.lock"
author-status: draft
---

# Zscaler MCP server — transport hardening, write gating, and inventory

## Release boundary

The checked tree declares MCP server v0.13.3. Its v0.13.2 notes restore in-process TLS, Host-header validation, and the global write-tools switch; the v0.13.3 entry is a dependency refresh (`vendor/zscaler-mcp-server/pyproject.toml:1-4`; `vendor/zscaler-mcp-server/CHANGELOG.md:3-25`). The generated v0.13.3 inventory remains 402 tools (`vendor/zscaler-mcp-server/README.md:502-524`): the per-service counts total 254 read tools and 148 write tools (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:28`; `:203`; `:321`; `:361`; `:374`; `:402`; `:421`; `:437`; `:462`; `:491`). The release delta therefore does not require a substantive rewrite of product-surface facts; it changes server transport, exposure controls, and dependency resolution (`vendor/zscaler-mcp-server/CHANGELOG.md:9-25`).

## In-process TLS for HTTP transports

The `streamable-http` and SSE runners can terminate TLS in process. TLS is enabled only when both `ZSCALER_MCP_TLS_CERTFILE` and `ZSCALER_MCP_TLS_KEYFILE` identify existing files; an encrypted key can additionally use `ZSCALER_MCP_TLS_KEYFILE_PASSWORD`, and `ZSCALER_MCP_TLS_CA_CERTS` can supply an existing CA-bundle file (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:159-200`; `:205-223`). With TLS kwargs present, the runner uses the `https` scheme and satisfies the non-localhost plaintext guard without `ZSCALER_MCP_ALLOW_HTTP` (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:220-240`).

Incomplete certificate/key configuration, a missing certificate or key, and a missing configured CA bundle each raise `SystemExit`; this validation runs before the HTTP app is started by Uvicorn (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:168-200`; `:220-246`; `:269-275`). The TLS tests cover the unset, incomplete, missing-file, password, and CA-forwarding cases (`vendor/zscaler-mcp-server/tests/test_cli.py:185-237`).

## Host validation and health checks

`ZSCALER_MCP_ALLOWED_HOSTS` is parsed as a comma-separated Host allowlist. When configured and not explicitly disabled, the Host-validation middleware rejects requests whose `Host` header does not match the allowlist (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:116-135`; `:180-232`; `:408-430`). Binding to `0.0.0.0` refuses startup unless an allowlist is present or `ZSCALER_MCP_DISABLE_HOST_VALIDATION=true` explicitly opts out (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:235-251`).

Host validation skips `/health`, `/healthz`, and `/ready`, and the transport wrapper places its configured health handler outermost so `GET` or `HEAD` probes can return without traversing the inner layers (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:180-202`; `:276-305`; `:389-430`).

## Write-tool exposure: executable behavior

The CLI restores `--enable-write-tools`, whose environment equivalent is `ZSCALER_MCP_WRITE_ENABLED`; `--write-tools` / `ZSCALER_MCP_WRITE_TOOLS` supplies fnmatch patterns that narrow write-tool selection (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:551-566`; `:771-790`). The executable selection behavior is:

| Configuration | Registered write tools | Evidence |
|---|---|---|
| Neither master switch nor allowlist | None | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:771-790`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:118-123` |
| `--enable-write-tools` or `ZSCALER_MCP_WRITE_ENABLED=true`, without an allowlist | All write tools | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:551-558`; `:771-790`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:91-95`; `:118-123` |
| A non-empty `--write-tools` / `ZSCALER_MCP_WRITE_TOOLS` allowlist, with or without the master switch | Only matching write tools | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:561-566`; `:771-790`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:118-123` |

This follows from the server enabling writes whenever either the parsed allowlist is present or the master switch is true, while the registry treats a missing allowlist as unrestricted once writes are enabled (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:771-790`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:91-95`; `:104-123`). Registry tests likewise assert that `enable_write=True` without an allowlist includes write tools, while a supplied pattern narrows them (`vendor/zscaler-mcp-server/tests/test_registry.py:171-189`).

### Upstream documentation contradiction

The README says both flags are mandatory and that `--enable-write-tools` alone registers zero write tools (`vendor/zscaler-mcp-server/README.md:114-145`). That conflicts with the executable behavior above, which exposes all write tools when the master switch is enabled and the allowlist is absent (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:771-790`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:91-95`; `:118-123`). Treat the code and its tests as the behavior of this pinned snapshot, and retain the README claim as an unresolved upstream documentation contradiction.

**Safety recommendation, not an executable requirement:** keep write mode disabled unless needed; when it is needed, always supply the narrowest practical explicit allowlist. This is repository guidance, but the current code does not enforce it (`vendor/zscaler-mcp-server/README.md:342-350`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:91-95`; `:118-123`).

## Dependency metadata divergence

The generated `requirements.txt` pins `zscaler-sdk-python==1.9.37`, while `uv.lock` resolves `zscaler-sdk-python` 1.9.38 (`vendor/zscaler-mcp-server/requirements.txt:258-265`; `vendor/zscaler-mcp-server/uv.lock:2255-2258`). Dependency provenance therefore depends on which installation artifact is used.

## Open questions

> - **Client-certificate enforcement** - The v0.13.2 release note describes `ZSCALER_MCP_TLS_CA_CERTS` as mutual-TLS client validation, but the implementation and test only establish that the CA-bundle path is forwarded as `ssl_ca_certs` (`vendor/zscaler-mcp-server/CHANGELOG.md:19-23`; `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:196-200`; `vendor/zscaler-mcp-server/tests/test_cli.py:221-237`) - *unverified, requires a client-certificate enforcement test or explicit Uvicorn client-cert requirement configuration*

## Cross-links

- For the unified API gateway and authentication model used below the MCP layer, see [`./oneapi.md`](./oneapi.md).
- For product-specific MCP surfaces, start from the relevant product `api.md` reference.
