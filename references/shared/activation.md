---
product: shared
topic: "activation-lifecycle"
title: "ZIA activation gate — staged vs live config"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources:
  - "vendor/zscaler-help/Configuring_URL_Categories_Using_API.pdf (p.1, activation instruction)"
  - "vendor/zscaler-sdk-python/zscaler/zia/activate.py"
  - "vendor/zscaler-mcp-server/commands/troubleshoot-user.md (activation-status check)"
  - "vendor/zscaler-mcp-server/skills/cross-product/troubleshoot-user-connectivity/SKILL.md"
author-status: reviewed
---

# ZIA activation gate

ZIA config changes are **staged** in pending state until explicitly activated. This is a common source of "why doesn't my rule change work?" confusion and worth checking early in any troubleshooting flow.

**ZPA does not have this concept** — ZPA changes propagate automatically on write. Only ZIA needs an activation step.

## Mechanism

Per *Configuring URL Categories Using API* p.1:

> After making any configuration changes, ensure that you activate them by sending a POST request to `/status`.

Every ZIA write (URL category, URL filtering rule, SSL inspection rule, CAC rule, advanced settings, etc.) bumps the configuration into a **pending** state. The pending config is not applied to live traffic until activation runs.

## API surface

From `vendor/zscaler-sdk-python/zscaler/zia/activate.py` and the legacy-API *Activation* reference (`vendor/zscaler-help/zia-activation.md`):

| Method | Path | Purpose |
|---|---|---|
| GET | `/zia/api/v1/status` | Current activation status (3-value enum — `ACTIVE` plus two others not enumerated in docs; confirm on first tenant fetch) |
| POST | `/zia/api/v1/status/activate` | Apply pending config changes |
| GET | `/zia/api/v1/eusaStatus/latest` | EUSA (End User Subscription Agreement) acceptance status — precondition for activation in some tenants |
| PUT | `/zia/api/v1/eusaStatus/{eusaStatusId}` | Update EUSA acceptance |

The EUSA endpoints are easy to miss; they enforce a click-through user agreement that must be accepted before certain config changes are activatable. If activation fails with an EUSA-related error, `GET /eusaStatus/latest` surfaces whether the tenant's EUSA is in "agreement pending" state.

Terraform equivalent: the `zia_activation_status` resource runs activation during `terraform apply`.

## Troubleshooting pattern (from MCP server)

When a tenant reports "I changed the rule and it's not taking effect," the MCP skill `skills/cross-product/troubleshoot-user-connectivity/` explicitly includes an activation-status check as a pre-step. Before blaming rule order, policy evaluation, or SSL bypass:

1. `GET /status` — is the tenant in `PENDING` state?
2. If yes — changes are staged but not live. Activation hasn't been triggered (or failed).
3. If the tenant uses Terraform: check whether `zia_activation_status` was applied after the last policy change.
4. If the tenant uses direct console / API: confirm the admin clicked "Activate" or called `POST /status/activate`.

## Failure modes

- **Silent staleness.** Pending changes show up in the admin console (sometimes with a banner) but the active policy is still the pre-change version. Support cases often start here.
- **Partial activation.** Multiple admins making concurrent changes can interleave pending state. Activating applies *all* pending changes in one atomic push — there's no selective activation of a subset.
- **Activation failure from quota or validation.** If a pending change exceeds a ranges-and-limitations ceiling (see `vendor/zscaler-help/ranges-limitations-zia.md`) or fails server-side validation, activation may fail with a specific error. The config remains staged; fix the offending resource and re-activate.

## ZPA contrast

Per `vendor/zscaler-sdk-python/README.md` and ZPA API docs, ZPA changes propagate on write — no activation step. This is why ZPA tooling (e.g., TF provider) doesn't ship a `zpa_activation_status` resource.

If a user reports "ZIA rule didn't take effect" vs "ZPA rule didn't take effect," the activation check applies only to the first. For ZPA "didn't take effect" questions, jump straight to rule-order / condition-evaluation.

## Cross-links

- ZIA API reference (includes activation endpoints in endpoint catalog) — [`../zia/api.md#activation-lifecycle`](../zia/api.md#activation-lifecycle)
- Cross-product troubleshooting workflow model — [`./policy-evaluation.md`](./policy-evaluation.md)
