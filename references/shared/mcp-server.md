---
product: shared
topic: "mcp-server"
title: "Zscaler MCP server — transport hardening, write gating, and inventory"
content-type: reference
last-verified: "2026-08-09"
verified-against:
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-mcp-server/pyproject.toml"
  - "vendor/zscaler-mcp-server/CHANGELOG.md"
  - "vendor/zscaler-mcp-server/README.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/server.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/auth.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/elicitation.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/audit.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/cloud/__init__.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/cloud/aws_secrets.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/encoding/encoder.py"
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
  - "vendor/zscaler-mcp-server/tests/test_bridge_confirmation.py"
  - "vendor/zscaler-mcp-server/tests/test_protocol_2026_07_28.py"
  - "vendor/zscaler-mcp-server/tests/test_audit.py"
  - "vendor/zscaler-mcp-server/tests/test_aws_secrets.py"
  - "vendor/zscaler-mcp-server/tests/test_encoding.py"
  - "vendor/zscaler-mcp-server/tests/test_dependency_caps.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/zscaler-mcp-server/.github/conformance-baseline.yml"
  - "vendor/zscaler-mcp-server/.github/conformance-baseline-next.yml"
  - "vendor/zscaler-mcp-server/requirements.txt"
  - "vendor/zscaler-mcp-server/uv.lock"
author-status: draft
---

# Zscaler MCP server — transport hardening, write gating, and inventory

## Release boundary

The checked tree declares MCP server v0.15.0 and requires Python
`>=3.11,<4.0` (`vendor/zscaler-mcp-server/pyproject.toml:1-6`). Version 0.15 is
a protocol and security-boundary release: it moves to MCP 2.x and the
`2026-07-28` revision, restores the documented two-part write gate, introduces
native human elicitation for deletes, protects multi-round request state, and
removes the confirmation bypass (`vendor/zscaler-mcp-server/CHANGELOG.md:3-39`).

## Full SDK-record return contract

For ordinary Zscaler API records, `output_view` is normally unset and the
server advertises no `outputSchema`; explicit output views are reserved for
synthetic results constructed by the server. This keeps an API-owned attribute
set from becoming a stale server-side enumeration
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:43-56`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/decorator.py:33-60`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:71-100`).

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
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:248-309`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:415-439`).
JMESPath is therefore caller-side, post-fetch filtering and projection, not an
API query sent to Zscaler
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:420-439`).

The result-shape rules are stable: omitting `query` or passing an empty string
returns the fetched data unchanged; no match becomes `[]`; a scalar is wrapped
in a list; and an invalid expression returns a one-item error record without
failing the tool call (`vendor/zscaler-mcp-server/src/zscaler_mcp/common/jmespath_utils.py:25-55`;
`vendor/zscaler-mcp-server/tests/test_jmespath.py:34-68`).

## In-process TLS for HTTP transports

The `streamable-http` and SSE runners can terminate TLS in process. TLS is enabled only when both `ZSCALER_MCP_TLS_CERTFILE` and `ZSCALER_MCP_TLS_KEYFILE` identify existing files; an encrypted key can additionally use `ZSCALER_MCP_TLS_KEYFILE_PASSWORD`, and `ZSCALER_MCP_TLS_CA_CERTS` can supply an existing CA-bundle file (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:495-538`). With TLS kwargs present, the runner uses the `https` scheme and satisfies the non-localhost plaintext guard without `ZSCALER_MCP_ALLOW_HTTP` (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:541-579`).

Incomplete certificate/key configuration, a missing certificate or key, and a missing configured CA bundle each raise `SystemExit`; this validation runs before the HTTP app is started by Uvicorn (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:495-538`; `:541-579`). The TLS tests cover the unset, incomplete, missing-file, password, and CA-forwarding cases (`vendor/zscaler-mcp-server/tests/test_cli.py:332-384`).

## Host validation and health checks

`ZSCALER_MCP_ALLOWED_HOSTS` is parsed as a comma-separated Host allowlist. When configured and not explicitly disabled, the Host-validation middleware rejects requests whose `Host` header does not match the allowlist (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:116-135`; `:180-232`; `:408-430`). Binding to `0.0.0.0` refuses startup unless an allowlist is present or `ZSCALER_MCP_DISABLE_HOST_VALIDATION=true` explicitly opts out (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:235-251`).

Host validation skips `/health`, `/healthz`, and `/ready`, and the transport wrapper places its configured health handler outermost so `GET` or `HEAD` probes can return without traversing the inner layers (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/hardening.py:180-202`; `:276-305`; `:389-430`).

## Toolset selection and exclusion

`--toolsets` selects toolsets and `--disabled-toolsets` removes them. Both use
exact toolset IDs rather than wildcard patterns, and the disabled set is
applied after the enabled set so denial wins when an ID appears in both
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:915-930`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:69-144`).
Unknown IDs produce a warning that names the unknown and known IDs, then boot
continues (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:253-272`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:61-67`).

## Write-tool exposure: executable behavior

The CLI exposes `--enable-write-tools`, whose environment equivalent is
`ZSCALER_MCP_WRITE_ENABLED`; `--write-tools` / `ZSCALER_MCP_WRITE_TOOLS`
supplies fnmatch patterns that narrow write-tool selection. Version 0.15
enforces the pair at the server-registration boundary, so the same fail-closed
rule applies to CLI use, tests, and embedded callers
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:303-368`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:931-948`). The executable
selection behavior is:

| Configuration | Registered write tools | Evidence |
|---|---|---|
| Neither master switch nor allowlist | None | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:337-368` |
| Master switch only | None; startup warning | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:337-348` |
| Non-empty allowlist only | None; startup warning | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:349-355` |
| Master switch plus non-empty allowlist | Only matching write tools | `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:359-368`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:106-112`; `:138-143` |

The v0.14 documentation-versus-code contradiction is closed at this pin: the
README and the executable boundary now agree that both controls are mandatory
(`vendor/zscaler-mcp-server/README.md:114-145`;
`vendor/zscaler-mcp-server/CHANGELOG.md:11-18`). This is a behavioral change
from v0.13–v0.14, where either half could expose writes and the switch with an
empty allowlist exposed every write tool.

### Delete confirmation and elicitation boundary

After write exposure is enabled, create and update calls execute without a
second confirmation channel. Only delete tools receive the bridge-owned
confirmation channels, and the gate runs before any SDK mutation
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:281-309`;
`:441-479`). Version 0.15 also removes `ZSCALER_MCP_SKIP_CONFIRMATIONS`; the
supported way to deny deletion is to omit delete patterns from the write
allowlist (`vendor/zscaler-mcp-server/CHANGELOG.md:11-18`).

For a client advertising MCP elicitation, the server returns a native
`delete`/`cancel` question. On revision `2026-07-28` that question travels as
an `InputRequiredResult` and the client retries with `input_responses` and sealed
`request_state`; older negotiated revisions use the mid-call
`elicitation/create` path. A refusal, cancellation, unusable result, unanswered
question, or internal capability-check failure stops before mutation
(`vendor/zscaler-mcp-server/src/zscaler_mcp/security/elicitation.py:390-422`;
`:448-559`; `:592-667`;
`vendor/zscaler-mcp-server/tests/test_bridge_confirmation.py:246-340`).

Clients without elicitation fall back to the HMAC retry token. That token is
parameter-bound, expires, and is single-use, but the agent receives it and can
redeem it; it is therefore a transaction-integrity control, not proof of an
independent human decision. The returned instruction tells the agent to ask and
wait, but this cannot be enforced on that fallback channel
(`vendor/zscaler-mcp-server/src/zscaler_mcp/security/elicitation.py:134-174`;
`:264-300`; `:390-422`).

The HMAC fallback is also **single-process**: its signing key and spent-token
ledger live only in the process that minted the token. A retry routed to another
replica, or sent after a restart, cannot complete that confirmation and must ask
again. Run one write-enabled replica when any client depends on the fallback;
`ZSCALER_MCP_REQUEST_STATE_KEYS` protects native `requestState` and does not make
HMAC tokens portable (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/elicitation.py:66-78`;
`vendor/zscaler-mcp-server/CHANGELOG.md:67-73`).

### Request-state protection and replay boundary

Native `requestState` is AES-256-GCM sealed, expires, and is bound to the exact
request and authenticated principal. It is **not single-use**: replaying the
same approved request as the same principal within the TTL can execute the same
delete again. Do not transfer the single-use property of the HMAC fallback
token to native elicitation state
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:89-108`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:394-407`).

Without `ZSCALER_MCP_REQUEST_STATE_KEYS`, each process uses an ephemeral key;
restarts invalidate pending state and another replica cannot decrypt it. A
shared ordered key ring is therefore required for multi-replica HTTP write
deployments. The first key seals, every listed key unseals, allowing rotation;
the setting accepts a JSON array or comma-separated list
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:110-169`; `:172-206`).

### Protocol revision and tool-list caching

The server negotiates `2026-07-28` with current clients while retaining older
revision compatibility. On the modern revision, confirmation uses the
stateless input-request loop; the protocol tests pin that transport distinction
instead of merely unit-testing the resolver
(`vendor/zscaler-mcp-server/tests/test_protocol_2026_07_28.py:1-49`;
`:213-240`). The stable conformance job still gates the published `2025-11-25`
suite; a separate prerelease-runner baseline exercises `2026-07-28` but is not
yet a CI gate (`vendor/zscaler-mcp-server/.github/conformance-baseline.yml:1-27`;
`vendor/zscaler-mcp-server/.github/conformance-baseline-next.yml:1-20`).

`tools/list` alone carries a public five-minute cache hint. This is safe only
because toolset, write, disabled-pattern, and entitlement filtering all resolve
once at registration and the inventory cannot change during the connection
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:77-86`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:394-406`).

The protocol revision also changes remote log-level control. MCP
`logging/setLevel` remains installed for `2025-06-18` and `2025-11-25` clients,
but the `2026-07-28` request surface removed that method; current clients are
expected to use the protocol's OpenTelemetry path instead. The retained handler
changes only the `zscaler_mcp` logger tree so a request for verbose MCP logs does
not enable dependency logging that may include credential-bearing headers
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:439-486`;
`vendor/zscaler-mcp-server/tests/test_protocol_2026_07_28.py:426-468`).

## MCP tool annotations

Every bridged tool receives annotations derived from its single action: reads
are read-only; creates are non-destructive and non-idempotent; updates and
deletes are destructive and idempotent. All tools set `openWorldHint=false`;
read tools leave the write-only destructive and idempotent hints unset
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:118-152`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:173-205`;
`vendor/zscaler-mcp-server/tests/test_tool_annotations.py:61-116`;
`vendor/zscaler-mcp-server/tests/test_tool_annotations.py:149-179`).

These annotations are advisory client metadata, not authorization or
confirmation controls. The server-side write-selection and delete-confirmation
gates still apply regardless of the advertised hints
(`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:173-205`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:441-470`).

## HTTP authentication changes

OIDC is now an OAuth 2.0 protected resource rather than a FastMCP `OIDCProxy`.
The server publishes RFC 9728 metadata naming the external identity provider and
verifies its bearer tokens; it does not host an authorization server or require
an OIDC client secret. The `oidcproxy` and `oauth-proxy` mode spellings remain as
aliases, but clients need an ID registered at the IdP because dynamic client
registration against this server is gone
(`vendor/zscaler-mcp-server/src/zscaler_mcp/security/auth.py:715-751`;
`:1135-1156`; `vendor/zscaler-mcp-server/CHANGELOG.md:13-16`).

API-key mode accepts either `Authorization: Bearer <key>` or `X-Api-Key` and
derives a stable one-way principal fingerprint rather than embedding the secret
in request state (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/auth.py:249-348`).
`ZSCALER_MCP_TRUST_PLATFORM_AUTH=true` is a separate, explicit relaxation for
platforms that authenticate every caller but cannot forward another credential;
it applies only to API-key and Zscaler auth modes and must not be enabled on a
directly reachable deployment (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/auth.py:80-106`;
`vendor/zscaler-mcp-server/CHANGELOG.md:37-39`).

## Operational logging and response encoding

Tool-call audit logging remains opt-in through
`ZSCALER_MCP_LOG_TOOL_CALLS=true`, but v0.15 now unpacks the positional Pydantic
input model used by the registry bridge. The `[TOOL CALL]` record therefore
contains the fields the caller actually supplied instead of an always-empty
`args: {}` object; secret-, password-, token-, and key-shaped names remain
redacted. Non-empty JMESPath projections are logged separately with row counts
before and after filtering
(`vendor/zscaler-mcp-server/src/zscaler_mcp/security/audit.py:64-98`;
`:124-145`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/fastmcp_bridge.py:430-438`).

Automatic wire encoding now treats empty lists, dictionaries, tuples, and sets
as CSV-safe cells while preserving them as `[]` or `{}`. A non-empty nested
value still forces JSON for the entire result, so the optimization reduces
repeated field-name overhead without flattening real structure
(`vendor/zscaler-mcp-server/src/zscaler_mcp/encoding/encoder.py:87-112`;
`:132-147`; `vendor/zscaler-mcp-server/tests/test_encoding.py:87-124`).

The server also passes its package version into MCP initialization; clients now
see `0.15.0` in `serverInfo` instead of an empty version
(`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:374-406`;
`vendor/zscaler-mcp-server/tests/test_cli.py:224-241`).

## Cloud credential loading

The published server now contains the AWS Secrets Manager loader that formerly
lived in the separate AgentCore build. Setting `ZSCALER_SECRET_NAME` opts in;
the optional `aws` extra supplies `boto3`, region resolution follows
`AWS_REGION`, `AWS_DEFAULT_REGION`, then the normal boto3 chain, and any fetch or
decode failure stops startup instead of deferring an opaque authentication
failure to the first tool call
(`vendor/zscaler-mcp-server/src/zscaler_mcp/cloud/aws_secrets.py:1-42`;
`:87-170`).

Only the loader's explicit credential/write/auth allowlist may enter the process
environment. Recognized secret values override stale deployment values, unknown
keys are reported and ignored, and startup verifies that a client secret or its
private-key equivalent is present. The shared cloud entry point runs both AWS
and GCP loaders before CLI defaults are parsed, allowing secret-managed write
and MCP-auth settings to take effect without a platform-specific server image
(`vendor/zscaler-mcp-server/src/zscaler_mcp/cloud/aws_secrets.py:53-84`;
`:173-249`; `vendor/zscaler-mcp-server/src/zscaler_mcp/cloud/__init__.py:1-24`;
`:70-82`).

## Dependency resolution

The protocol dependency is now `mcp[cli]>=2.0.0,<3`. MCP 2.0 is the floor for
`InputRequiredResult`, request-state security, and cache hints; the next major
remains capped. Standalone `fastmcp` is neither a base dependency nor an extra,
and tests also prohibit importing it or instructing operators to install a
prerelease manually (`vendor/zscaler-mcp-server/pyproject.toml:20-37`;
`:90-107`; `vendor/zscaler-mcp-server/tests/test_dependency_caps.py:57-136`).

The generated requirements and lock now agree on MCP 2.0.0 and
`zscaler-sdk-python` 1.9.41, and the editable root in the lock correctly reports
0.15.0. The v0.14 FastMCP and root-version consistency gaps are retired
(`vendor/zscaler-mcp-server/requirements.txt:94-110`;
`vendor/zscaler-mcp-server/requirements.txt:255`;
`vendor/zscaler-mcp-server/uv.lock:894-913`;
`vendor/zscaler-mcp-server/uv.lock:2325-2397`).

## Open questions

> - **Client-certificate enforcement** - The v0.13.2 release note describes `ZSCALER_MCP_TLS_CA_CERTS` as mutual-TLS client validation, but the implementation and test only establish that the CA-bundle path is forwarded as `ssl_ca_certs` (`vendor/zscaler-mcp-server/CHANGELOG.md:126-138`; `vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:505-509`; `vendor/zscaler-mcp-server/tests/test_cli.py:368-384`) - *unverified, requires a client-certificate enforcement test or explicit Uvicorn client-cert requirement configuration*

## Cross-links

- For the unified API gateway and authentication model used below the MCP layer, see [`./oneapi.md`](./oneapi.md).
- For product-specific MCP surfaces, start from the relevant product `api.md` reference.
