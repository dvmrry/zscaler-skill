---
product: shared
topic: "activation-lifecycle"
title: "Activation gates — ZIA + CBC have them, others don't"
content-type: reference
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/Configuring_URL_Categories_Using_API.pdf (p.1, activation instruction)"
  - "vendor/zscaler-help/automate-zscaler/api-reference-zia-sample-endpoints.md"
  - "vendor/zscaler-help/automate-zscaler/getting-started.md"
  - "vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/activate.py"
  - "vendor/zscaler-mcp-server/commands/troubleshoot-user.md (activation-status check)"
  - "vendor/zscaler-mcp-server/skills/cross-product/troubleshoot-user-connectivity/SKILL.md"
author-status: reviewed
---

# Activation gates — ZIA + CBC have them, others don't

**Two products in the OneAPI suite have an activation gate**: ZIA and Cloud & Branch Connector (CBC / ZTW). Their config changes are **staged** in pending state until explicitly activated. The other five products — ZPA, ZDX, ZIdentity, ZCC, BI — apply changes on write with no activation step.

This asymmetry is the #1 source of "why doesn't my rule change work?" confusion in cross-product automation. Always check activation status early in any ZIA or CBC troubleshooting flow.

## Per-product summary

| Product | Activation? | Status endpoint | Activate endpoint | Notes |
|---|---|---|---|---|
| **ZIA** | Yes | `GET /zia/api/v1/status` | `POST /zia/api/v1/status/activate` | The original activation gate |
| **CBC (ZTW)** | Yes | `GET /ztw/api/v1/ecAdminActivateStatus` | `POST /ztw/api/v1/ecAdminActivateStatus/activate` | Plus `POST /ztw/api/v1/ecAdminActivateStatus/forceActivate` for stuck activations |
| ZPA | No | — | — | Propagates on write |
| ZDX | No | — | — | Read-only API; configuration is portal-only |
| ZIdentity | No | — | — | Identity changes apply on write |
| ZCC | No | — | — | Profile/policy changes apply on write |
| BI | No | — | — | Reporting-only; no traffic-affecting config |

## ZIA mechanism

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

## CBC mechanism (parallel but with `forceActivate`)

CBC's activation gate works the same way as ZIA's — except CBC ships **two activate endpoints**, not one:

| Method | Path | Purpose |
|---|---|---|
| GET | `/ztw/api/v1/ecAdminActivateStatus` | Current activation status |
| POST | `/ztw/api/v1/ecAdminActivateStatus/activate` | Normal activation |
| POST | `/ztw/api/v1/ecAdminActivateStatus/forceActivate` | **Force-activate when normal activation is blocked** |

**`forceActivate` is a last-resort signal.** Its existence — parallel to ZIA which has only `activate` — implies that CBC's activation pipeline can get stuck in ways ZIA's doesn't (more validation, more cross-resource consistency checks, edit-lock complexity from multi-VM Cloud Connector groups). Operationally:

- Use `activate` first.
- If it fails repeatedly with errors that look like state-consistency issues, `forceActivate` is the bypass.
- `forceActivate` skips at least some validation that protects against pushing broken config to live; only use it when you've confirmed the underlying issue is not a config-correctness problem.
- Terraform: `ztc_activation_status` resource (likely with a `force` toggle — check the provider schema).

## `409 EDIT_LOCK_NOT_AVAILABLE` — concurrent writes

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

During Zscaler-side maintenance, ZIA returns 403 with a discriminator:

```http
HTTP/1.1 403
x-zscaler-mode: read-only

{ "code": "STATE_READONLY", "message": "The API service is undergoing a scheduled upgrade and is in read-only mode." }
```

Both `x-zscaler-mode: read-only` and `STATE_READONLY` are reliable discriminators — distinguish maintenance-window 403 from authorization 403. Scripts should treat read-only-mode 403 as transient and retry with backoff; treat plain 403 (no header, no `STATE_READONLY` code) as an authorization issue requiring config fix.

## Troubleshooting pattern (from MCP server)

When a tenant reports "I changed the rule and it's not taking effect," the MCP skill `skills/cross-product/troubleshoot-user-connectivity/` explicitly includes an activation-status check as a pre-step. Before blaming rule order, policy evaluation, or SSL bypass:

1. `GET /status` (ZIA) or `GET /ecAdminActivateStatus` (CBC) — is the tenant in `PENDING` state?
2. If `INPROGRESS` — wait; activation is mid-flight.
3. If `PENDING` — changes are staged but not live. Activation hasn't been triggered (or failed).
4. If the tenant uses Terraform: check whether `zia_activation_status` / `ztc_activation_status` was applied after the last policy change.
5. If the tenant uses direct console / API: confirm the admin clicked "Activate" or called the activate endpoint.

## Failure modes

- **Silent staleness.** Pending changes show up in the admin console (sometimes with a banner) but the active policy is still the pre-change version. Support cases often start here.
- **Partial activation.** Multiple admins making concurrent changes can interleave pending state. Activating applies *all* pending changes in one atomic push — there's no selective activation of a subset.
- **Activation failure from quota or validation.** If a pending change exceeds a ranges-and-limitations ceiling (see `vendor/zscaler-help/ranges-limitations-zia.md`) or fails server-side validation, activation may fail with a specific error. The config remains staged; fix the offending resource and re-activate.

## ZPA / ZDX / ZIdentity / ZCC / BI contrast

These five products propagate on write — no activation step. ZPA's TF provider deliberately doesn't ship a `zpa_activation_status` resource (no equivalent exists). The same goes for ZDX (read-only), ZIdentity (identity changes), ZCC (profile/policy), and BI (reporting).

If a user reports "rule didn't take effect," **branch the activation check by product**:
- ZIA / CBC → check activation status first.
- Anything else → skip activation; jump straight to rule-order / condition-evaluation / cache-staleness.

## Cross-links

- ZIA API reference (activation endpoints in endpoint catalog) — [`../zia/api.md#activation-lifecycle`](../zia/api.md)
- CBC activation deep-dive — [`../cloud-connector/api.md § Activation`](../cloud-connector/api.md)
- OneAPI cross-product activation summary — [`./oneapi.md § Activation gate`](./oneapi.md)
- Cross-product troubleshooting workflow model — [`./policy-evaluation.md`](./policy-evaluation.md)
