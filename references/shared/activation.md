---
product: shared
topic: "activation-lifecycle"
title: "Activation gates — ZIA + CBC have them, others don't"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-ztc: 6516b4a032ef4a5ece183a0f42a5026b11ac94ca
  vendor/zscaler-sdk-go: 8a73a5fcf0bbb8507a47c09e9a6f379447ce3807
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/Configuring_URL_Categories_Using_API.txt"
  - "vendor/zscaler-help/legacy-activation.md"
  - "vendor/zscaler-help/automate-zscaler/api-reference-zia-sample-endpoints.md"
  - "vendor/zscaler-help/automate-zscaler/getting-started.md"
  - "vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/activate.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/activation.py"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go"
  - "vendor/terraform-provider-zia/docs/guides/zia-activator-overview.md"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_activation_status.go"
  - "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json"
  - "vendor/zscaler-mcp-server/commands/troubleshoot-user.md"
  - "vendor/zscaler-mcp-server/skills/cross-product/troubleshoot-user-connectivity/SKILL.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/activation.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/list_devices.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zdx/active_devices.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zdx/troubleshoot_user_experience.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
author-status: draft
---

# Activation gates — ZIA + CBC have them, others don't

**Two products in the captured OneAPI activation documentation have an activation gate**: ZIA and Cloud & Branch Connector (CBC / ZTW). Their configuration changes are **staged** in pending state until activation occurs. CBC exposes explicit activation operations; ZIA supports explicit activation but also autoactivates when an API/admin session ends, as detailed below. Other products either apply supported writes immediately or expose read-only/read-heavy surfaces; absence of an activation gate does not mean a product has no write operations.

This asymmetry is the #1 source of "why doesn't my rule change work?" confusion in cross-product automation. Always check activation status early in any ZIA or CBC troubleshooting flow.

## Per-product summary

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-help/automate-zscaler/api-reference-zia-sample-endpoints.md`; `vendor/zscaler-sdk-python/zscaler/zia/activate.py`.

| Product | Activation? | Status endpoint | Activate endpoint | Notes |
|---|---|---|---|---|
| **ZIA** | Yes | `GET /zia/api/v1/status` | `POST /zia/api/v1/status/activate` | The original activation gate |
| **CBC (ZTW)** | Yes | `GET /ztw/api/v1/ecAdminActivateStatus` | `PUT /ztw/api/v1/ecAdminActivateStatus/activate` | Also exposes `PUT /ztw/api/v1/ecAdminActivateStatus/forcedActivate`; its extra semantics are not documented in captured static sources |
| ZPA | No | — | — | Propagates on write |
| ZDX | No | — | — | Read-heavy; current MCP can start/delete deep traces and score analyses, and those diagnostic-session writes have no separate activation step (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:319-355`) |
| ZIdentity | No | — | — | Identity changes apply on write |
| ZCC | No | — | — | Profile/policy changes apply on write |
| BI | No | — | — | Reporting-only; no traffic-affecting config |

## ZIA mechanism

Source: `vendor/zscaler-help/Configuring_URL_Categories_Using_API.txt`; `vendor/zscaler-help/legacy-activation.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-sdk-python/zscaler/zia/activate.py`.

Every ZIA write (URL category, URL filtering rule, SSL inspection rule, CAC rule, advanced settings, etc.) bumps the configuration into **pending** state. The pending config is not applied to live traffic until activation runs.

### Status enum

`GET /zia/api/v1/status` returns:

```json
{ "status": "ACTIVE" }
```

Three values:

| Status | Meaning |
|---|---|
| `ACTIVE` | All committed config is live; no pending changes |
| `PENDING` | Changes are staged but not yet activated |
| `INPROGRESS` | Activation is currently running (transient; should clear within seconds-to-minutes) |

Scripts must handle `INPROGRESS` as a non-terminal state — poll until `ACTIVE` or `PENDING` (i.e., the activation completed and either succeeded or there are still pending changes from a concurrent edit).

### API surface

| Method | Path | Purpose |
|---|---|---|
| GET | `/zia/api/v1/status` | Current activation status |
| POST | `/zia/api/v1/status/activate` | Apply pending config changes |
| GET | `/zia/api/v1/eusaStatus` | EUSA (End User Subscription Agreement) acceptance status — precondition for activation in some tenants |
| PUT | `/zia/api/v1/eusaStatus` | Update EUSA acceptance |

The EUSA endpoints are easy to miss; they enforce a click-through user agreement that must be accepted before certain config changes are activatable. If activation fails with an EUSA-related error, `GET /eusaStatus` surfaces whether the tenant's EUSA is in "agreement pending" state.

Terraform equivalent: the `zia_activation_status` resource runs activation during `terraform apply`.

### Session-boundary autoactivation

ZIA also autoactivates pending changes when an API/admin session ends, including when the API session reaches the configured `api_session_timeout`. That timeout accepts 5–20 minutes and defaults to 5; a long Terraform apply can therefore publish a partial set of changes mid-run, after which the provider opens another session and continues (`vendor/terraform-provider-zia/docs/guides/zia-activator-overview.md:64-70`). The behavior is platform-native and cannot be disabled by the provider. Before a large apply, raise the timeout to 20 minutes and split work so a single apply is unlikely to cross the boundary (`vendor/terraform-provider-zia/docs/guides/zia-activator-overview.md:72-91`).

Activation remains tenant-wide and can queue behind other editing sessions; a queued activation cannot be cancelled. Serialize write-bearing applies by tenant and run one explicit activation only after the final apply (`vendor/terraform-provider-zia/docs/guides/zia-activator-overview.md:93-114`).

## CBC mechanism (parallel, with a separate forced endpoint)

Source: `vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json`; `vendor/zscaler-sdk-python/zscaler/ztw/activation.py`; `vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go`; `vendor/terraform-provider-ztc/ztc/resource_ztc_activation_status.go`.

CBC also stages changes behind an activation gate and ships **two activate endpoints**, not one. The captured CBC sources do not establish whether ZIA's session-boundary autoactivation behavior also applies to CBC:

| Method | Path | Purpose |
|---|---|---|
| GET | `/ztw/api/v1/ecAdminActivateStatus` | Current activation status |
| PUT | `/ztw/api/v1/ecAdminActivateStatus/activate` | Normal activation |
| PUT | `/ztw/api/v1/ecAdminActivateStatus/forcedActivate` | Force-activate configuration changes |

The captured Automate contract describes the second operation only as “Force activates configuration changes,” and both SDKs expose it as an explicit force choice (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:104-116`; `vendor/zscaler-sdk-python/zscaler/ztw/activation.py:35-67`; `vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go:47-58`). None of those sources says it bypasses validation, overrides an edit lock, or is specifically a stuck-activation recovery path. Operationally:

- Use `activate` first.
- Do not infer recovery or validation-bypass semantics from the word “force”; confirm intended use with Zscaler before automating it.
- Terraform's `ztc_activation_status` resource calls only normal `UpdateActivationStatus` and exposes no force toggle (`vendor/terraform-provider-ztc/ztc/resource_ztc_activation_status.go:71-85`, `:117-123`). Use an SDK or the raw API only when forced activation has been explicitly chosen and operationally justified.

## `409 EDIT_LOCK_NOT_AVAILABLE` — concurrent writes

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-sdk-python/zscaler/request_executor.py`.

A common failure mode on both ZIA and CBC: writing config while another admin or script holds the edit lock returns:

```http
HTTP/1.1 409 Conflict
{ "code": "EDIT_LOCK_NOT_AVAILABLE", ... }
```

Causes:

- Two scripts writing concurrently
- A script running while a human edits via the UI
- Two processes against the same tenant

**This is not an auth error.** Newcomers often misdiagnose it. The fix is sequence: take an explicit lock, write, activate, release. Don't run parallel writers against the same ZIA or CBC tenant.

## Read-only mode (scheduled maintenance)

Source: `vendor/zscaler-help/automate-zscaler/guides-response-codes.md`; `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/api-authentication-overview.md`.

During Zscaler-side maintenance, ZIA returns 403 with a discriminator:

```http
HTTP/1.1 403
x-zscaler-mode: read-only

{ "code": "STATE_READONLY", "message": "The API service is undergoing a scheduled upgrade and is in read-only mode." }
```

Both `x-zscaler-mode: read-only` and `STATE_READONLY` are reliable discriminators — distinguish maintenance-window 403 from authorization 403. Scripts should treat read-only-mode 403 as transient and retry with backoff; treat plain 403 (no header, no `STATE_READONLY` code) as an authorization issue requiring config fix.

## Troubleshooting pattern

Source: `vendor/zscaler-help/legacy-activation.md`; `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-sdk-python/zscaler/zia/activate.py`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/activation.py`; `vendor/zscaler-mcp-server/skills/cross-product/troubleshoot-user-connectivity/SKILL.md`.

When a tenant reports "I changed the rule and it's not taking effect," make activation status an early check for ZIA and CBC. Before blaming rule order, policy evaluation, or SSL bypass:

1. `GET /status` (ZIA) or `GET /ecAdminActivateStatus` (CBC) — is the tenant in `PENDING` state?
2. If `INPROGRESS` — wait; activation is mid-flight.
3. If `PENDING` — changes are staged but not live. Activation hasn't been triggered (or failed).
4. If the tenant uses Terraform: check whether `zia_activation_status` / `ztc_activation_status` was applied after the last policy change.
5. If the tenant uses direct console / API: confirm the admin clicked "Activate" or called the activate endpoint.

The current MCP source directly implements ZIA status and activation tools (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/activation.py:29-62`), and its bundled cross-product workflow calls `zia_get_activation_status` (`vendor/zscaler-mcp-server/skills/cross-product/troubleshoot-user-connectivity/SKILL.md:260-266`). MCP v0.15.0 does not expose a corresponding ZTW/CBC activation tool, so the CBC branch above is grounded in the captured Help/API contract rather than in MCP tool coverage.

### Bundled MCP workflow drift

The legacy command and cross-product skill still exist in v0.15.0, but they are not fully aligned with the rewritten Pydantic tool schemas. Both pass a nonexistent `search` argument to `zcc_list_devices` and `zdx_list_devices` (`vendor/zscaler-mcp-server/commands/troubleshoot-user.md:24-41`; `vendor/zscaler-mcp-server/skills/cross-product/troubleshoot-user-connectivity/SKILL.md:47-49`, `:89-99`), while the current ZCC input uses `username` and the ZDX input uses `emails`, `user_ids`, MAC/IP, and scope filters (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/list_devices.py:24-39`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zdx/active_devices.py:27-58`).

The guided ZDX prompt still repeats the unsupported `search` call and asks
`zdx_get_device` for device-level health fields
(`vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zdx/troubleshoot_user_experience.py:36-42`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zdx/troubleshoot_user_experience.py:68-73`),
but the former curated identity-only output restriction is gone. The list tool
calls `shape_many(raw_devices)` with no shaper argument, and the get tool passes
the returned SDK model's `as_dict()` record to `shape_one`
(`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zdx/active_devices.py:94-128`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zdx/active_devices.py:131-162`).
Those helpers preserve the attributes present in the supplied SDK-modeled
record, so actual output fields now depend on what the SDK returns rather than
an MCP identity-field whitelist; this still does not guarantee that every
health field named by the prompt will be present
(`vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`). Treat
the activation-status step as verified, but resolve current tool inputs and
returned records from `src/zscaler_mcp/tools/` rather than copying the bundled
workflow verbatim.

The generated tool catalog carries one more migration artifact: its contributor note still says to edit the removed `zscaler_mcp/services.py` catalog (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:7`). In v0.15.0, tools self-register through `@tool` and the central registry explicitly says it is populated at import time instead of from a hand-maintained list (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:1-8`, `:145-146`). Treat the generated tables as the inventory view, but use the co-located `src/zscaler_mcp/tools/` definitions as the source for tool descriptions and schemas.

## Failure modes

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/legacy-activation.md`; `vendor/zscaler-help/ranges-limitations-zia.md`; `vendor/zscaler-sdk-python/zscaler/zia/activate.py`.

- **Silent staleness.** Pending changes show up in the admin console (sometimes with a banner) but the active policy is still the pre-change version. Support cases often start here.
- **Partial activation.** Multiple admins making concurrent changes can interleave pending state. Activating applies *all* pending changes in one atomic push — there's no selective activation of a subset.
- **Activation failure from quota or validation.** If a pending change exceeds a ranges-and-limitations ceiling (see `vendor/zscaler-help/ranges-limitations-zia.md`) or fails server-side validation, activation may fail with a specific error. The config remains staged; fix the offending resource and re-activate.

## ZPA / ZDX / ZIdentity / ZCC / BI contrast

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-sdk-python/zscaler/zia/activate.py`.

These products do not use the ZIA/CBC activation pattern. ZPA's Terraform provider does not ship a `zpa_activation_status` resource. ZIdentity and ZCC changes apply on write, while BI is reporting-oriented. ZDX is read-heavy rather than strictly read-only: MCP v0.15.0 includes four gated diagnostic-session writes (`zdx_start_deeptrace`, `zdx_delete_deeptrace`, `zdx_start_analysis`, and `zdx_delete_analysis`) with no separate activation call (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:319-355`).

If a user reports "rule didn't take effect," **branch the activation check by product**:
- ZIA / CBC → check activation status first.
- Products without a documented activation gate → skip activation and move to the product's own rule-order, condition-evaluation, propagation, or session-state checks.

## Cross-links

- ZIA API reference (activation endpoints in endpoint catalog) — [`../zia/api.md#activation-lifecycle`](../zia/api.md)
- CBC activation deep-dive — [`../cloud-connector/api.md § Activation`](../cloud-connector/api.md)
- OneAPI cross-product activation summary — [`./oneapi.md § Activation gate`](./oneapi.md)
- Cross-product troubleshooting workflow model — [`./policy-evaluation.md`](./policy-evaluation.md)
