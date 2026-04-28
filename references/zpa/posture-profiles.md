---
product: zpa
topic: "posture-profiles"
title: "ZPA Posture Profiles — policy-side consumer of ZCC posture signals"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zpa/posture_profiles.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_posture_profile.go"
  - "vendor/terraform-provider-zpa/zpa/common.go"
  - "vendor/zscaler-help/about-device-posture-profiles.md"
  - "vendor/zscaler-help/configuring-device-posture-profiles.md"
  - "vendor/zscaler-help/configuring-client-certificate-posture-check-linux.md"
author-status: draft
---

# ZPA Posture Profiles — policy-side consumer of ZCC posture signals

A ZPA Posture Profile is a **read-only ZPA object** that represents a device-posture check result surface defined in ZCC. It is **not created by the operator via the API** — it is provisioned by the Zscaler platform when a ZCC posture profile is created in the admin console and is then discovered by the operator via `GET /posture`. The operator's job is to look up an existing profile's `posture_udid` and reference it in ZPA access policy conditions.

The help portal page for ZPA Posture Profiles returns 404 as of April 2026. Field-level detail in §3 is sourced from SDK code; treat as **confidence: medium**. Evaluation mechanics (§1–§2) are sourced from vendor help (`about-device-posture-profiles.md`, `configuring-device-posture-profiles.md`) — **confidence: high**.

---

## 1. The two-layer model — ZCC evaluates, ZPA consumes

ZPA Posture Profiles must not be confused with ZCC Device Posture Profiles. These are different objects in different products:

| Layer | Product | Role |
|---|---|---|
| Device Posture Profile (criteria definition) | ZCC admin console | Defines what checks run; named bundle of posture criteria |
| Posture Profile object | ZPA API | Named stable policy handle to ZCC profile results; read-only; consumed by ZPA policy rules |

The flow:

```
ZCC (endpoint)
  └─ evaluates ZCC Device Posture Profile (checks: cert, OS version, EDR, etc.)
       └─ produces: PASS / FAIL per profile (every 15 min or on state change)
            └─ tunnel reports posture_udid + result to ZPA

ZPA Access / Timeout / Forwarding Policy rule
  └─ condition: object_type = "POSTURE"
       lhs = <posture_udid>     (the profile's unique identifier)
       rhs = "true"             (match if device passed that profile)
            └─ if match: rule fires (Allow / Block / RE_AUTH / BYPASS)
```

ZCC evaluates on a configurable cadence (default 15 min, min 2 min for ZCC 4.4+ Windows / 4.5+ macOS). New connections pick up the latest evaluation. **Existing tunnels are not retroactively revoked** on posture failure — they persist until the tunnel drops. Bound posture staleness using ZPA Reauth Timeout.

---

## 2. ZCC posture check types

Posture profiles (defined in the ZCC admin console at Policies > Common Configuration > Resources > Device Posture) support the following check types (Tier A — vendor doc, `configuring-device-posture-profiles.md`):

| Posture Type | Windows | macOS | Linux | iOS | Android | Immediate re-eval on change |
|---|---|---|---|---|---|---|
| Certificate Trust | Yes | Yes | | | | |
| File Path | Yes | Yes | Yes | | | |
| Registry Key | Yes | | | | | |
| Client Certificate | Yes | Yes | | | | |
| Firewall | Yes | Yes | | | | |
| Full Disk Encryption | Yes | Yes | | | | |
| Domain Joined | Yes | Yes | | | | |
| AzureAD Domain Joined | Yes | | | | | |
| Process Check | Yes | Yes | | | | Yes |
| Detect Carbon Black | Yes | Yes | | | | Yes |
| Detect CrowdStrike | Yes | Yes | | | | Yes |
| CrowdStrike ZTA Score | Yes | Yes | | | | |
| CrowdStrike ZTA Device OS Score | Yes | | | | | |
| CrowdStrike ZTA Sensor Setting Score | Yes | | | | | |
| Detect SentinelOne | Yes | Yes | | | | Yes |
| Detect Microsoft Defender | Yes | | | | | Yes |
| Detect Antivirus | Yes | Yes | | | | |
| Ownership Variable | Yes | | | | | |
| Unauthorized Modification | Yes | | | | | |
| OS Version | Yes | Yes | Yes | Yes | Yes | |
| Jamf Detection | | Yes | | | | |
| Server Validated Client Certificate | Yes | | | | | |
| Zscaler Client Connector Version | Yes | Yes | Yes | Yes | Yes | |

Five types re-evaluate **immediately on device state change**: Process Check, Detect Carbon Black, Detect CrowdStrike, Detect SentinelOne, Detect Microsoft Defender. All others follow the configured frequency.

### 2.1 Machine Tunnel eligible posture types

When a ZCC posture profile has "Apply to Windows Machine Tunnel" or "Apply to macOS Machine Tunnel" checked, only a subset of posture types can evaluate in the pre-login context:

- **Windows Machine Tunnel:** Client Certificate, Certificate Trust, File Path, Registry Key, Firewall, Full Disk Encryption, Domain Joined, AzureAD Domain Joined, Server Validated Client Certificate, OS Version, Zscaler Client Connector Version.
- **macOS Machine Tunnel:** CrowdStrike ZTA Score, Full Disk Encryption, File Path, Firewall, Domain Joined, OS Version, Zscaler Client Connector Version.

User-context-dependent types (Process Check, AV detection, Ownership Variable) cannot evaluate pre-login — they require a logged-in user.

### 2.2 Client Certificate posture check — Linux specifics

Linux has additional setup requirements for the Client Certificate posture check (Tier A — vendor doc, `configuring-client-certificate-posture-check-linux.md`):

1. Install ZCC on the Linux client.
2. In the admin console, upload a CA certificate (root CA or intermediate) from an internal root CA trusted by the organization.
3. Copy the client certificate file (`client_cert.pem`, Base64-encoded, `.pem` extension) to one of two locations based on the Non-Exportable Private Key setting:
   - **Non-Exportable Private Key disabled:** `~/.Zscaler/certificates/` (user access permission).
   - **Non-Exportable Private Key enabled:** `/opt/zscaler/client_cert/` (root access only).
4. Verify certificate installation: `openssl verify -show_chain -CApath /etc/ssl/certs/ <client_cert_file>` (Ubuntu) or with `/etc/pki/ca-trust/extracted/pem/` (CentOS/Fedora).
5. Copy the private key to the matching location:
   - Non-Exportable disabled: `~/.Zscaler/certificates/private/` (`.key` extension, Base64-encoded).
   - Non-Exportable enabled: `/opt/zscaler/private_key/` (root-owned, permission 755; posture validation fails if readable by non-root).
6. Log in to ZCC.

The `non_exportable_private_key_enabled` field on the ZPA Posture Profile object (`nonExportablePrivateKeyEnabled`) reflects this configuration.

---

## 3. ZPA Posture Profile object structure

Fields confirmed from both SDK implementations. All fields are **read-only** — no POST/PUT/DELETE endpoints exist.

| Field (Python SDK) | Wire JSON key | Go SDK field | Type | Notes |
|---|---|---|---|---|
| `id` | `id` | `ID` | string | ZPA object ID; used for `GET /posture/{id}` |
| `name` | `name` | `Name` | string | Human-readable label; matches ZCC profile name with cloud suffix (e.g., `CrowdStrike_ZPA_ZTA_80 (zscalertwo.net)`) |
| `posture_udid` | `postureUdid` | `PostureudID` | string | **The key identifier for policy conditions** — use this as `lhs` in policy operands, not `id` |
| `master_customer_id` | `masterCustomerId` | `MasterCustomerID` | string | Tenant that owns the profile definition |
| `zscaler_customer_id` | `zscalerCustomerId` | `ZscalerCustomerID` | string | Customer ID within the Zscaler cloud |
| `zscaler_cloud` | `zscalerCloud` | `ZscalerCloud` | string | Cloud instance (e.g., `zscalertwo.net`); corresponds to the suffix in profile name |
| `domain` | `domain` | `Domain` | string | Domain scope; Go SDK only |
| `posture_type` | `postureType` | `PostureType` | string | Type of posture check (e.g., CrowdStrike, Certificate) |
| `root_cert` | `rootCert` | `RootCert` | string | Root certificate for certificate-based posture checks |
| `platform` | `platform` | `Platform` | list / string | Platform constraint; Python SDK models as list, Go SDK as string — wire format likely a list |
| `apply_to_machine_tunnel_enabled` | `applyToMachineTunnelEnabled` | `ApplyToMachineTunnelEnabled` | bool | Whether this profile evaluates against Machine Tunnel (pre-login) connections |
| `crl_check_enabled` | `crlCheckEnabled` | `CRLCheckEnabled` | bool | Enables CRL checking for certificate-based posture profiles |
| `non_exportable_private_key_enabled` | `nonExportablePrivateKeyEnabled` | `NonExportablePrivateKeyEnabled` | bool | Enforces non-exportable private key requirement (Linux certificate posture) |
| `creation_time` | `creationTime` | `CreationTime` | string | Read-only timestamp |
| `modified_time` | `modifiedTime` | `ModifiedTime` | string | Read-only timestamp |
| `modified_by` | `modifiedBy` | `ModifiedBy` | string | Read-only audit field |

**Python SDK serialization bug:** `models/posture_profiles.py:104` serializes `rootCert` with a trailing tab character (`"rootCert\t"`). Since profiles are read-only, calling `request_format()` is low-risk in practice, but the output will have a malformed key if used in a debugging context.

---

## 4. API endpoints

| Operation | Method | Endpoint | Notes |
|---|---|---|---|
| List all profiles | GET | `/zpa/mgmtconfig/v2/admin/customers/{customerId}/posture` | Paginated; supports `search`, `page`, `page_size` |
| Get by ID | GET | `/zpa/mgmtconfig/v1/admin/customers/{customerId}/posture/{id}` | Uses v1 endpoint |
| Get by posture UDID | — | (client-side scan of list results) | No dedicated endpoint; both SDKs iterate and match on `postureUdid` |
| Get by name | — | (server search + client-side `strings.EqualFold`) | Go SDK strips cloud suffix before comparison via `RemoveCloudSuffix` |

No POST, PUT, or DELETE endpoints exist. Profiles are provisioned by Zscaler, not the operator.

---

## 5. How posture profiles attach to ZPA access policy rules

Posture criteria use the `entry_values` operand form — `{lhs, rhs}` pairs — not the `values` form used for App Segments and Segment Groups. This distinction matters when constructing policy programmatically.

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

Python SDK conditions format for posture:

```python
conditions = [
    ("posture", [("posture-udid-value", True)]),   # True = device passed
]
```

**`rhs` values:**
- `"true"` — device **passed** this posture check
- `"false"` — device **failed** this posture check (used to build deny/restrict rules for non-compliant devices)

**`lhs` must be `posture_udid`**, not `id` and not `name`. The Terraform provider enforces this at plan time by calling `postureprofile.GetByPostureUDID()` to validate the `lhs` value. Using the wrong identifier silently produces a policy condition that never matches.

**Policy types that accept POSTURE conditions** (Tier A — `common.go` line 1334):
- Access Policy (`ACCESS_POLICY` / v2 access rules)
- Forwarding Policy (`CLIENT_FORWARDING_POLICY` / v2 forwarding rules)
- Timeout Policy — use `rhs = "false"` to target non-compliant devices with shorter session timeouts

---

## 6. Evaluation timing

- ZCC evaluates posture profiles every **15 minutes** by default (Tier A — vendor doc).
- **Configurable:** ZCC 4.4+ for Windows, ZCC 4.5+ for macOS — per-posture-type frequency from 2 to 15 minutes.
- Five types re-evaluate **immediately on state change** (see §2 table).
- Network-event triggers: Zscaler service restart, device reboot, network join, hibernation exit, domain join, Wi-Fi/Ethernet switch, Wi-Fi network change.
- **Existing connections are not affected** by posture result changes — only new connections pick up the updated result. Bound posture staleness using ZPA Reauth Timeout.

---

## 7. SDK/Terraform resource fields

### Python SDK — `PostureProfilesAPI`

| Property | `client.zpa.posture_profiles` |
|---|---|
| Class | `PostureProfilesAPI` |
| File | `zscaler/zpa/posture_profiles.py` |
| Go parity | `postureprofile/` |

**Methods:**

| Method | Signature |
|---|---|
| `list_posture_profiles` | `(query_params=None) -> APIResult[List[PostureProfile]]` |
| `get_posture_profile` | `(profile_id: str, query_params=None) -> APIResult[PostureProfile]` |

No write methods exist — profiles are provisioned by Zscaler.

### Terraform

Only a **data source** exists: `data "zpa_posture_profile"`. No resource — posture profiles cannot be created or managed via Terraform. Look up by `name` (including the cloud suffix) or by `posture_udid`. The data source exposes: `id`, `name`, `posture_udid`, `domain`, `posture_type`, `zscaler_cloud`, `zscaler_customer_id`.

---

## 8. Relationship to ZCC device posture vs ZPA posture profiles

This is the most common source of confusion:

| Concept | Where configured | What it does | SDK-mutable? |
|---|---|---|---|
| ZCC Device Posture Profile | ZCC admin console (or via `shared/device-posture.md` patterns) | Defines criteria (file path, EDR, OS version, etc.); evaluated by ZCC on the endpoint | Yes — ZCC/admin side |
| ZPA Posture Profile | ZPA API (read-only) | Named handle to the ZCC profile's result; used as policy condition `lhs` | No — Zscaler-provisioned |

A ZPA Posture Profile appears in the API only after the corresponding ZCC Device Posture Profile is created in the admin console. If a profile expected in a Terraform plan is missing, the root cause is the ZCC-side profile not yet existing or not yet synced — not a Terraform state issue.

For the full posture type catalog, platform support matrix, machine tunnel integration, and ZIA consumption via Trust Levels, see [`../shared/device-posture.md`](../shared/device-posture.md).

---

## 9. Gotchas

**1. `lhs` must be `posture_udid`, not `id` or `name`.**
The ZPA API validates at rule creation; the Terraform provider validates at plan time. `id` is only valid for `GET /posture/{id}` lookups. The correct workflow: list profiles → extract `posture_udid` → use in policy.

**2. Profile names include a cloud suffix that must match exactly when looked up by name.**
Go SDK `GetByName` strips `(zscalertwo.net)` before comparison. Python SDK does not — callers must handle the suffix themselves or use UDID lookups.

**3. No create/update/delete — profiles are Zscaler-provisioned.**
Attempting `POST /posture` will fail. If a profile is missing, create the corresponding ZCC Device Posture Profile in the admin console and wait for sync.

**4. `rhs = "false"` targets non-compliant devices, not absent profiles.**
A device that has never reported a result for a given posture profile is distinct from a device that reported a failure. The behavior for "profile not evaluated" vs "profile evaluated and failed" is not documented. Combine POSTURE conditions with CLIENT_TYPE conditions to ensure the client type is expected to report the profile.

**5. `platform` field type diverges between SDKs.**
Python SDK models `platform` as a list; Go SDK models it as a string. The wire format is likely a list; the Go SDK may be silently truncating. Do not rely on `platform` for policy construction — use explicit PLATFORM conditions on the policy rule.

**6. Browser Access users never match POSTURE conditions.**
Browser Access sessions have no ZCC agent; posture signals are unavailable. A rule with `rhs = "true"` will never match for BA sessions — they get a generic deny.

**7. `apply_to_machine_tunnel_enabled` must match the ZCC profile setting.**
If the ZCC profile does not have machine tunnel enabled, the ZPA profile field will be false. Posture profiles used in Machine Tunnel policies must have this flag set in the ZCC admin console.

---

## Cross-links

- ZCC posture evaluation layer (where signals originate) — [`../shared/device-posture.md`](../shared/device-posture.md)
- Policy precedence, condition AND/OR semantics, operand match forms, Timeout Policy posture tiering — [`./policy-precedence.md`](./policy-precedence.md)
- SDK PostureProfilesAPI method catalog — [`./sdk.md §2.24 PostureProfilesAPI`](./sdk.md)
- Browser Access posture interaction — [`./browser-access.md §7`](./browser-access.md)
