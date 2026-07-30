---
product: shared
topic: "mcp-server"
title: "Zscaler MCP server — transport hardening, write gating, and inventory"
content-type: reference
last-verified: "2026-07-26"
verified-against:
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-mcp-server/pyproject.toml"
  - "vendor/zscaler-mcp-server/CHANGELOG.md"
  - "vendor/zscaler-mcp-server/README.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/server.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/elicitation.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/decorator.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/common/jmespath_utils.py"
  - "vendor/zscaler-mcp-server/tests/test_cli.py"
  - "vendor/zscaler-mcp-server/tests/test_registry.py"
  - "vendor/zscaler-mcp-server/tests/test_shaping_helpers.py"
  - "vendor/zscaler-mcp-server/tests/test_jmespath.py"
  - "vendor/zscaler-mcp-server/tests/test_tool_annotations.py"
  - "vendor/zscaler-mcp-server/tests/test_dependency_caps.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/zscaler-mcp-server/.github/conformance-baseline.yml"
  - "vendor/zscaler-mcp-server/requirements.txt"
  - "vendor/zscaler-mcp-server/uv.lock"
author-status: draft
---

# Zscaler MCP server — transport hardening, write gating, and inventory

## Release boundary

The checked tree declares MCP server v0.14.0 and requires Python
`>=3.11,<4.0` (`vendor/zscaler-mcp-server/pyproject.toml:1-6`).

## Full SDK-record return contract

For ordinary Zscaler API records, `output_view` is normally unset and the
server advertises no `outputSchema`; explicit output views are reserved for
synthetic results constructed by the server. This keeps an API-owned attribute
set from becoming a stale server-side enumeration
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:43-56`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/decorator.py:33-60`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:48-75`).

At the shaping boundary, a dict is copied and an SDK model is converted with
`as_dict()` when available. `shape_one` then overlays any normalized or
computed view fields on the complete record, while `shape_many` applies the
same rule to every row; tests cover nested and extra fields and enforce that
record-returning tools do not declare enumerating output views
(`vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`;
`vendor/zscaler-mcp-server/tests/test_shaping_helpers.py:45-89`;
`vendor/zscaler-mcp-server/tests/test_shaping_helpers.py:97-134`).

The word **full** is scoped to the SDK-modeled dict delivered to the shaper,
after SDK decoding and any earlier tool cleanup or unwrapping. It is a
field-preservation contract at that boundary, not a promise of byte-identical
raw HTTP JSON (`vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`).

## Caller-directed JMESPath projection

Collection reads receive an optional `query` parameter when they are declared
as list tools or are list-style reads returning an envelope; writes, single
object gets, and tools with synthetic output views do not. The bridge removes
`query` from the tool input, invokes the tool first, and only then applies the
JMESPath expression before encoding and token accounting
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:98-116`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:183-247`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:272-301`).
JMESPath is therefore caller-side, post-fetch filtering and projection, not an
API query sent to Zscaler
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:272-301`).

The result-shape rules are stable: omitting `query` or passing an empty string
returns the fetched data unchanged; no match becomes `[]`; a scalar is wrapped
in a list; and an invalid expression returns a one-item error record without
failing the tool call (`vendor/zscaler-mcp-server/src/zscaler_mcp/common/jmespath_utils.py:25-55`;
`vendor/zscaler-mcp-server/tests/test_jmespath.py:33-67`;
`vendor/zscaler-mcp-server/tests/test_jmespath.py:75-160`).

## In-process TLS for HTTP transports

The `streamable-http` and SSE runners can terminate TLS in process. TLS is enabled only when both `ZSCALER_MCP_TLS_CERTFILE` and `ZSCALER_MCP_TLS_KEYFILE` identify existing files; an encrypted key can additionally use `ZSCALER_MCP_TLS_KEYFILE_PASSWORD`, and `ZSCALER_MCP_TLS_CA_CERTS` can supply an existing CA-bundle file (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:159-200`; `:205-223`). With TLS kwargs present, the runner uses the `https` scheme and satisfies the non-localhost plaintext guard without `ZSCALER_MCP_ALLOW_HTTP` (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:220-240`).

Incomplete certificate/key configuration, a missing certificate or key, and a missing configured CA bundle each raise `SystemExit`; this validation runs before the HTTP app is started by Uvicorn (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:168-200`; `:220-246`; `:269-275`). The TLS tests cover the unset, incomplete, missing-file, password, and CA-forwarding cases (`vendor/zscaler-mcp-server/tests/test_cli.py:185-237`).

## Host validation and health checks

`ZSCALER_MCP_ALLOWED_HOSTS` is parsed as a comma-separated Host allowlist. When configured and not explicitly disabled, the Host-validation middleware rejects requests whose `Host` header does not match the allowlist (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:116-135`; `:180-232`; `:408-430`). Binding to `0.0.0.0` refuses startup unless an allowlist is present or `ZSCALER_MCP_DISABLE_HOST_VALIDATION=true` explicitly opts out (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:235-251`).

Host validation skips `/health`, `/healthz`, and `/ready`, and the transport wrapper places its configured health handler outermost so `GET` or `HEAD` probes can return without traversing the inner layers (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:180-202`; `:276-305`; `:389-430`).

## Toolset selection and exclusion

`--toolsets` selects toolsets and `--disabled-toolsets` removes them. Both use
exact toolset IDs rather than wildcard patterns, and the disabled set is
applied after the enabled set so denial wins when an ID appears in both
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:572-587`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:69-142`).
Unknown IDs produce a warning that names the unknown and known IDs, then boot
continues (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:55-74`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:132-148`).

## Write-tool exposure: executable behavior

The CLI exposes `--enable-write-tools`, whose environment equivalent is
`ZSCALER_MCP_WRITE_ENABLED`; `--write-tools` / `ZSCALER_MCP_WRITE_TOOLS`
supplies fnmatch patterns that narrow write-tool selection
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:589-604`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:809-813`). The executable
selection behavior is:

| Configuration | Registered write tools | Evidence |
|---|---|---|
| Neither master switch nor allowlist | None | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:809-813`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:106-110`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:136-140` |
| `--enable-write-tools` or `ZSCALER_MCP_WRITE_ENABLED=true`, without an allowlist | All write tools | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:589-604`; `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:809-813`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:106-110`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:136-140` |
| A non-empty `--write-tools` / `ZSCALER_MCP_WRITE_TOOLS` allowlist, with or without the master switch | Only matching write tools | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:589-604`; `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:809-813`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:106-110`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:136-140` |

This follows from the server enabling writes whenever either the parsed
allowlist is present or the master switch is true, while the registry treats a
missing allowlist as unrestricted once writes are enabled
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:809-813`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:106-110`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:136-140`).

### Upstream documentation contradiction

The README says both flags are mandatory and that `--enable-write-tools` alone registers zero write tools (`vendor/zscaler-mcp-server/README.md:114-145`). That conflicts with the executable behavior above, which exposes all write tools when the master switch is enabled and the allowlist is absent (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:809-813`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:106-110`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:136-140`). Treat the code as the behavior of this pinned snapshot, and retain the README claim as an unresolved upstream documentation contradiction.

### Delete confirmation and elicitation boundary

After write exposure is enabled, create and update calls execute without a
second confirmation channel. Only delete tools receive the bridge-owned
`kwargs` channel and must pass the HMAC confirmation check before the SDK
mutation (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:249-262`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:281-294`).
The human-facing delete message now identifies a resource by explicit `id`,
then `name`, then the first populated `*_id` key in sorted order, falling back
to `unknown` (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/elicitation.py:125-166`).

This is the existing HMAC retry-message flow, not native MCP server-initiated
elicitation. Native elicitation remains unimplemented in the conformance
baseline (`vendor/zscaler-mcp-server/.github/conformance-baseline.yml:28-37`).

## MCP tool annotations

Every bridged tool receives annotations derived from its single action: reads
are read-only; creates are non-destructive and non-idempotent; updates and
deletes are destructive and idempotent. All tools set `openWorldHint=false`;
read tools leave the write-only destructive and idempotent hints unset
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:118-152`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:148-180`;
`vendor/zscaler-mcp-server/tests/test_tool_annotations.py:61-116`;
`vendor/zscaler-mcp-server/tests/test_tool_annotations.py:149-179`).

These annotations are advisory client metadata, not authorization or
confirmation controls. The server-side write-selection and delete-confirmation
gates still apply regardless of the advertised hints
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:148-180`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:249-262`).

## Dependency resolution

The project deliberately caps the current protocol stack below MCP 2 and
FastMCP 4: `mcp[cli]>=1.23.0,<2` and `fastmcp>=2.13.0,<4`. Dependency tests
assert the present 1.x/3.x versions are admitted and the next majors are not
(`vendor/zscaler-mcp-server/pyproject.toml:31-39`;
`vendor/zscaler-mcp-server/tests/test_dependency_caps.py:35-54`).

The generated `requirements.txt` pins FastMCP 3.4.4, JMESPath 1.1.0, MCP
1.28.1, and `zscaler-sdk-python` 1.9.39
(`vendor/zscaler-mcp-server/requirements.txt:65`;
`vendor/zscaler-mcp-server/requirements.txt:95`;
`vendor/zscaler-mcp-server/requirements.txt:115`;
`vendor/zscaler-mcp-server/requirements.txt:265`). The lock agrees on SDK
1.9.39 but resolves FastMCP 3.4.5
(`vendor/zscaler-mcp-server/uv.lock:481-506`;
`vendor/zscaler-mcp-server/uv.lock:2255-2264`).

The lock's editable root package still says 0.13.3 even though
`pyproject.toml` says 0.14.0, and its FastMCP 3.4.5 resolution differs from the
generated requirements pin. These are upstream repository consistency gaps and
open issues, not Zscaler product behavior
(`vendor/zscaler-mcp-server/pyproject.toml:1-6`;
`vendor/zscaler-mcp-server/uv.lock:2205-2208`;
`vendor/zscaler-mcp-server/uv.lock:481-506`;
`vendor/zscaler-mcp-server/requirements.txt:65`).

## Open questions

> - **Client-certificate enforcement** - The v0.13.2 release note describes `ZSCALER_MCP_TLS_CA_CERTS` as mutual-TLS client validation, but the implementation and test only establish that the CA-bundle path is forwarded as `ssl_ca_certs` (`vendor/zscaler-mcp-server/CHANGELOG.md:29-35`; `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:196-200`; `vendor/zscaler-mcp-server/tests/test_cli.py:221-237`) - *unverified, requires a client-certificate enforcement test or explicit Uvicorn client-cert requirement configuration*

## Cross-links

- For the unified API gateway and authentication model used below the MCP layer, see [`./oneapi.md`](./oneapi.md).
- For product-specific MCP surfaces, start from the relevant product `api.md` reference.
