---
product: zpa
topic: "posture-profiles"
title: "ZPA Posture Profiles — policy-side consumer of ZCC posture signals (sourced from SDK / TF; help portal gap)"
content-type: reasoning
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zpa/posture_profiles.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_posture_profile.go"
  - "vendor/terraform-provider-zpa/zpa/common.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_forwarding_rule_test.go"
author-status: draft
---

# ZPA Posture Profiles — policy-side consumer of ZCC posture signals

> **Source gap — help portal non-functional.** As of April 2026, the Zscaler help-portal page for ZPA Posture Profiles returns 404. This document is sourced entirely from the Python SDK (`posture_profiles.py` + `models/posture_profiles.py`), the Go SDK (`postureprofile/zpa_posture_profile.go`), and the Terraform provider (`data_source_zpa_posture_profile.go`, `common.go`). Treat all field-level detail as **confidence: medium** — no authoritative help-portal description could be cross-checked.

## What a ZPA Posture Profile is

A ZPA Posture Profile is a **read-only ZPA object** that represents a device-posture check result surface defined in ZCC. It is **not created by the operator** — it is provisioned by the Zscaler platform when a ZCC posture profile is created on the admin side, and is discovered by the operator via `GET /posture`. The operator's job is to look up an existing profile's `posture_udid` and reference it in policy conditions.

It is a named bundle of posture metadata that ZPA Access Policy, Timeout Policy, and Forwarding Policy rules can consume as criteria. The profile object itself does not define what checks run on the device — that is ZCC's job (see [`../zcc/device-posture.md`](../zcc/device-posture.md)). The profile object is ZPA's stable policy handle to the result of those checks.

**The two layers must not be confused:**

| Layer | Product | Role |
|---|---|---|
| Posture evaluation | ZCC | Runs checks on the endpoint; produces pass/fail per profile |
| Posture Profile object | ZPA | Named reference to a ZCC profile; consumed by ZPA policy rules as criteria |

## The flow

```
ZCC (endpoint)
  └─ evaluates posture profile (checks: cert, OS version, EDR, etc.)
       └─ produces: PASS / FAIL  per profile
            └─ tunnel reports posture_udid + result to ZPA

ZPA Access / Timeout / Forwarding Policy rule
  └─ condition: object_type = "POSTURE"
       lhs = <posture_udid>   (the profile's unique identifier)
       rhs = "true"           (match if the device passed that profile)
            └─ if match: rule fires (Allow / Block / RE_AUTH / BYPASS)
```

ZCC evaluates on a configurable cadence (default 15 min); policy sees the last-reported result. New connections pick up the latest evaluation; existing tunnels are not retroactively revoked. For cadence and staleness detail see [`../zcc/device-posture.md § Evaluation cadence`](../zcc/device-posture.md).

## Field schema

Fields common to both SDK implementations. All fields are **read-only from the operator's perspective** — ZPA Posture Profiles are not created or updated via the operator API; only `GET` and list operations exist.

| Field (SDK Python) | Wire JSON key | Go SDK field | Type | Notes |
|---|---|---|---|---|
| `id` | `id` | `ID` | string | ZPA object ID. Used for `GET /posture/{id}`. |
| `name` | `name` | `Name` | string | Human-readable label; matches the ZCC profile name with cloud suffix appended (e.g., `CrowdStrike_ZPA_ZTA_80 (zscalertwo.net)`). |
| `posture_udid` | `postureUdid` | `PostureudID` | string | **The key identifier for policy.** This value — not `id` — is the `lhs` in policy operands. Globally unique across the ZPA cloud. |
| `master_customer_id` | `masterCustomerId` | `MasterCustomerID` | string | Identifies the tenant that owns the profile definition. |
| `zscaler_customer_id` | `zscalerCustomerId` | `ZscalerCustomerID` | string | The customer ID within the Zscaler cloud. |
| `zscaler_cloud` | `zscalerCloud` | `ZscalerCloud` | string | Cloud instance (e.g., `zscalertwo.net`). Corresponds to the suffix appended to the profile name in the admin console. |
| `domain` | `domain` | `Domain` | string | Domain scope for the profile. Go SDK only; not modeled in Python SDK. |
| `posture_type` | `postureType` | `PostureType` | string | Type of posture check (e.g., CrowdStrike, Certificate). Enum values not enumerated in SDK source. |
| `root_cert` | `rootCert` | `RootCert` | string | Root certificate for certificate-based posture checks. |
| `platform` | `platform` | `Platform` | string / list | Platform constraint. Python SDK models as a list of strings; Go SDK as a single string. |
| `apply_to_machine_tunnel_enabled` | `applyToMachineTunnelEnabled` | `ApplyToMachineTunnelEnabled` | bool | Whether this profile evaluates against Machine Tunnel (pre-login) connections. |
| `crl_check_enabled` | `crlCheckEnabled` | `CRLCheckEnabled` | bool | Enables CRL checking for certificate-based posture profiles. |
| `non_exportable_private_key_enabled` | `nonExportablePrivateKeyEnabled` | `NonExportablePrivateKeyEnabled` | bool | Enforces non-exportable private key requirement (Linux certificate posture path). |
| `creation_time` | `creationTime` | `CreationTime` | string | Read-only timestamp. |
| `modified_time` | `modifiedTime` | `ModifiedTime` | string | Read-only timestamp. |
| `modified_by` | `modifiedBy` | `ModifiedBy` | string | Read-only audit field. |

**Python SDK `request_format()` note:** The model includes a typo in the serialization path — `"rootCert\t"` (trailing tab character in the key string at `models/posture_profiles.py:104`). If serializing a `PostureProfile` instance back to JSON via `request_format()`, the `rootCert` key will have a trailing tab and will be ignored or rejected by the API. Since the profiles are read-only this is low-risk, but worth noting if `request_format()` is ever called in a debugging context.

## API endpoints

| Operation | Method | Endpoint | Notes |
|---|---|---|---|
| List all profiles | `GET` | `/zpa/mgmtconfig/v2/admin/customers/{customerId}/posture` | Paginated; supports `search`, `page`, `page_size`. |
| Get by ID | `GET` | `/zpa/mgmtconfig/v1/admin/customers/{customerId}/posture/{id}` | Uses v1. |
| Get by posture UDID | — | (client-side scan of `GetAll` results) | No dedicated endpoint; both SDKs iterate the full list and match on `postureUdid`. |
| Get by name | — | (server search + client-side `strings.EqualFold`) | Go SDK strips the cloud suffix before comparison via `RemoveCloudSuffix`. |

There are no `POST`, `PUT`, or `DELETE` endpoints for this resource in either SDK. Profiles are provisioned by Zscaler, not the operator.

## How policy rules reference Posture Profiles

Posture criteria use the `entry_values` operand form — `{lhs, rhs}` pairs — not the `values` form used for App Segments and Segment Groups. This distinction matters when constructing policy programmatically (see [`./policy-precedence.md § Operand match forms`](./policy-precedence.md)).

```hcl
# Terraform: look up a posture profile, then reference posture_udid in policy
data "zpa_posture_profile" "crwd_zta_score_80" {
  name = "CrowdStrike_ZPA_ZTA_80 (zscalertwo.net)"
}

resource "zpa_policy_forwarding_rule" "example" {
  conditions {
    operator = "OR"
    operands {
      object_type = "POSTURE"
      lhs         = data.zpa_posture_profile.crwd_zta_score_80.posture_udid
      rhs         = "false"   # "false" = device failed this posture check
    }
  }
}
```

**Policy types that accept POSTURE conditions** (source: `common.go` line 1334 — the `entry_values` validation block):
- Access Policy (`ACCESS_POLICY` / v2 access rules)
- Forwarding Policy (`CLIENT_FORWARDING_POLICY` / v2 forwarding rules)
- Timeout Policy — explicitly called out in `policy-precedence.md`: set `rhs = "false"` to target non-compliant devices with shorter session timeouts

The `rhs` value is always the string `"true"` or `"false"`:
- `rhs = "true"` — device **passed** this posture check
- `rhs = "false"` — device **failed** this posture check (used to build deny/restrict rules for non-compliant devices)

The `lhs` is the `posture_udid` — not the profile `id` and not the profile `name`. Using the wrong identifier silently produces a policy condition that never matches. Source (Tier A): `common.go` line 139 validates the `lhs` by calling `postureprofile.GetByPostureUDID(ctx, zClient.Service, operand.LHS)` — the TF provider enforces this at plan time.

## Gotchas

**1. `lhs` must be `posture_udid`, not `id`.**
Source (Tier A): `common.go` lines 135–146 validate the `POSTURE` operand `lhs` by calling `GetByPostureUDID`. The ZPA API also validates at rule creation. `id` is a valid ZPA object identifier for `GET /posture/{id}` lookups but is never valid as the `lhs` of a policy operand. The correct workflow: list profiles, extract `posture_udid`, use that value in policy.

**2. Profile names include a cloud-suffix that must match exactly when looked up by name.**
Source (Tier A): Go SDK `GetByName` calls `common.RemoveCloudSuffix` before comparison, meaning it strips `(zscalertwo.net)` and similar suffixes before matching. The Python SDK's `list_posture_profiles` does not strip suffixes — callers searching by name must handle the suffix themselves or use UDID lookups instead.

**3. No create/update/delete — profiles are Zscaler-provisioned.**
Neither SDK exposes mutation endpoints. Attempting to `POST /posture` will fail. Profiles appear in the API only after the corresponding ZCC posture profile is created in the admin console. If a profile expected in a TF plan is missing, the root cause is the ZCC-side profile not yet existing or not yet synced, not a TF state issue.

**4. `rhs = "false"` targets non-compliant devices — not the absence of a profile.**
Tier-D inference: a device that has never reported a result for a given posture profile is distinct from a device that reported a failure. The behavior for "profile not evaluated" vs "profile evaluated and failed" is not documented in any SDK source. Treat "profile not evaluated" as a potential blind spot in posture-gating rules. Operators who need hard guarantees should combine a POSTURE condition with a CLIENT_TYPE condition to ensure the client type in question is always expected to report the profile.

**5. `platform` field type divergence between SDKs.**
Python SDK (`models/posture_profiles.py:62`) models `platform` as `ZscalerCollection.form_list(config["platform"], str)` — a list. Go SDK (`zpa_posture_profile.go:27`) models `platform` as `string`. The TF data source does not expose `platform` at all. The wire format is likely a list, and the Go SDK may be silently truncating or using a comma-joined string. Tier D — unconfirmed from source alone. Do not rely on `platform` for policy construction; use explicit PLATFORM conditions on the policy rule itself.

**6. Timeout Policy condition support is narrower.**
From `policy-precedence.md`: Timeout Policy does NOT support `COUNTRY_CODE`, `TRUSTED_NETWORK`, or `CLIENT_TYPE` conditions. `POSTURE` conditions ARE supported on Timeout Policy — confirmed by the MCP skills reference in `policy-precedence.md`. Inspection Policy (v2) has a narrower condition set and likely does not support POSTURE; unconfirmed from source.

## Cross-links

- ZCC posture evaluation layer — where the signals come from — [`../zcc/device-posture.md`](../zcc/device-posture.md)
- Policy precedence, condition AND/OR semantics, operand match forms, Timeout Policy posture tiering — [`./policy-precedence.md`](./policy-precedence.md)
- Segment Groups and Server Groups — similar SDK-only-sourced object pattern — [`./segment-server-groups.md`](./segment-server-groups.md)
- Shared device posture concept, platform matrix, machine-tunnel integration — [`../shared/device-posture.md`](../shared/device-posture.md)
- Portfolio map — [`../_portfolio-map.md`](../_portfolio-map.md)
