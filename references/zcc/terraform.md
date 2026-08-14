---
product: zcc
topic: "zcc-terraform"
title: "ZCC Terraform provider — resource and data-source surface"
content-type: reference
last-verified: "2026-06-02"
verified-against:
  vendor/terraform-provider-zcc: 37aaa1f69786ee5263b358c5248a5b4ce014ebb8
confidence: medium
source-tier: code
sources:
  - "vendor/terraform-provider-zcc/docs/index.md"
  - "vendor/terraform-provider-zcc/docs/resources/zcc_device_cleanup.md"
  - "vendor/terraform-provider-zcc/docs/resources/zcc_failopen_policy.md"
  - "vendor/terraform-provider-zcc/docs/resources/zcc_forwarding_profile.md"
  - "vendor/terraform-provider-zcc/docs/resources/zcc_notification_template.md"
  - "vendor/terraform-provider-zcc/docs/resources/zcc_trusted_network.md"
  - "vendor/terraform-provider-zcc/docs/resources/zcc_web_privacy.md"
  - "vendor/terraform-provider-zcc/docs/resources/zcc_zia_posture.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_admin_roles.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_admin_user.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_company_info.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_custom_ip_apps.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_device_cleanup.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_devices.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_failopen_policy.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_forwarding_profile.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_notification_template.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_predefined_ip_apps.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_process_based_apps.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_trusted_network.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_web_app_service.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_web_privacy.md"
  - "vendor/terraform-provider-zcc/docs/data-sources/zcc_zia_posture.md"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend.go"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/backend_v1.go"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/backend_v2.go"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/convert.go"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend_test.go"
  - "vendor/terraform-provider-zcc/internal/framework/resources/trusted_network.go"
  - "vendor/terraform-provider-zcc/internal/framework/datasources/trusted_network.go"
author-status: draft
---

# ZCC Terraform provider — resource and data-source surface

Source: `vendor/terraform-provider-zcc/docs/index.md`.

The `zscaler/zcc` Terraform provider manages a subset of Zscaler Client Connector configuration through the ZCC public API. The pinned provider authenticates through OneAPI / ZIdentity and does not expose the older legacy ZCC V2 client path.

## Provider authentication

Source: `vendor/terraform-provider-zcc/docs/index.md`.

The provider uses the standard OneAPI credential shape:

| Provider argument | Environment variable | Notes |
|---|---|---|
| `client_id` | `ZSCALER_CLIENT_ID` | OAuth client ID from ZIdentity. |
| `client_secret` | `ZSCALER_CLIENT_SECRET` | Conflicts with `private_key`. |
| `private_key` | `ZSCALER_PRIVATE_KEY` | Alternative OAuth private-key auth. |
| `vanity_domain` | `ZSCALER_VANITY_DOMAIN` | Tenant vanity domain. |
| `zscaler_cloud` | `ZSCALER_CLOUD` | Optional; required for non-default clouds such as beta. |

The provider docs explicitly state that legacy `zcc_client_id` / `zcc_client_secret` / `zcc_cloud` authentication is not supported.

## Resource catalog

Source: `vendor/terraform-provider-zcc/docs/resources/zcc_forwarding_profile.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_trusted_network.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_failopen_policy.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_device_cleanup.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_web_privacy.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_zia_posture.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_notification_template.md`.

| Terraform resource | ZCC surface | Notes |
|---|---|---|
| `zcc_forwarding_profile` | Forwarding profile | Manages trusted-network matching and per-network ZIA/ZPA/unified-tunnel forwarding actions. |
| `zcc_trusted_network` | Trusted network | Manages named trusted-network criteria used by forwarding profiles. |
| `zcc_failopen_policy` | Fail-open policy | Manages fail-open and captive-portal behavior. |
| `zcc_device_cleanup` | Device cleanup policy | Manages enrolled-device cleanup settings. |
| `zcc_web_privacy` | Web privacy | Manages endpoint privacy/logging collection flags. |
| `zcc_zia_posture` | ZIA posture profile | Manages device posture profiles and trust-tier criteria evaluated by Client Connector. |
| `zcc_notification_template` | Notification template | Manages end-user notification templates and per-service ZIA/ZPA notification toggles. |

## Data-source catalog

Source: `vendor/terraform-provider-zcc/docs/data-sources/zcc_forwarding_profile.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_trusted_network.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_failopen_policy.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_device_cleanup.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_web_privacy.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_zia_posture.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_notification_template.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_devices.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_admin_user.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_admin_roles.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_company_info.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_custom_ip_apps.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_predefined_ip_apps.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_process_based_apps.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_web_app_service.md`.

| Terraform data source | ZCC surface | Notes |
|---|---|---|
| `zcc_forwarding_profile` | Forwarding profile lookup | Reads a forwarding profile by query criteria. |
| `zcc_trusted_network` | Trusted network lookup | Reads trusted-network records. |
| `zcc_failopen_policy` | Fail-open policy lookup | Reads the tenant fail-open policy. |
| `zcc_device_cleanup` | Device cleanup lookup | Reads cleanup policy state. |
| `zcc_web_privacy` | Web privacy lookup | Reads web privacy configuration. |
| `zcc_zia_posture` | ZIA posture lookup | Reads posture profiles. |
| `zcc_notification_template` | Notification template lookup | Reads notification templates. |
| `zcc_devices` | Device inventory | Reads enrolled device records. |
| `zcc_admin_user` | Admin user lookup | Reads ZCC admin users. |
| `zcc_admin_roles` | Admin role lookup | Reads ZCC admin roles. |
| `zcc_company_info` | Company info | Reads tenant/company metadata. |
| `zcc_custom_ip_apps` | Custom IP apps | Reads custom IP application definitions. |
| `zcc_predefined_ip_apps` | Predefined IP apps | Reads predefined IP application definitions. |
| `zcc_process_based_apps` | Process-based apps | Reads process-based app definitions. |
| `zcc_web_app_service` | Web app service | Reads web app service entries. |

## Trusted-network provider compatibility boundary

Source: `vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend.go`; `vendor/terraform-provider-zcc/internal/framework/tnbackend/backend_v1.go`; `vendor/terraform-provider-zcc/internal/framework/tnbackend/backend_v2.go`; `vendor/terraform-provider-zcc/internal/framework/tnbackend/convert.go`; `vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend_test.go`; `vendor/terraform-provider-zcc/internal/framework/resources/trusted_network.go`; `vendor/terraform-provider-zcc/internal/framework/datasources/trusted_network.go`.

At the refreshed `terraform-provider-zcc` snapshot (`v0.1.2-beta.3`), the trusted-network resource and data source use a provider-side backend selector. It probes the v2 list endpoint once per SDK service and caches the selected v2 or v1 adapter; the following dispositions describe provider behavior only, not backend contract truth.

| Concern | Current provider disposition |
|---|---|
| Generic 400/403 v2 fallback | The provider classifies `400`, `403`, `404`, `405`, `501`, and `resource.not.found` as v2 endpoint-unavailable and falls back to v1; its tests explicitly cover 400 and 403. This remains a broad client-side fallback classification. (`tnbackend.go:123-199`; `tnbackend_test.go:258-292`) |
| `ALL` / `ANY` enum | The refreshed commit changes the v1 adapter to encode `ALL` as `0` and `ANY` as `1`, decode those values back, and preserve unknown numeric values as decimal strings. This narrows the provider conversion defect, but does not prove the backend's enum meaning or establish v1/v2 equivalence. (`convert.go:12-54`; `tnbackend_test.go:14-66`) |
| Numeric state round-trip | The adapter parses v1 string IDs into the canonical integer model and serializes them back; the resource stores the canonical ID as Terraform string state. Unit coverage demonstrates an ordinary canonical→v1→canonical ID round-trip, not live API or backend stability. (`convert.go:78-146`; `tnbackend_test.go:107-256`; `resources/trusted_network.go:357-400`) |
| Substring lookup | Exact case-insensitive name matches win; a single case-insensitive partial match is accepted, while multiple partial matches return ambiguity. v1 scans paginated results locally and v2 delegates keyword/filter search before applying the same selector. (`tnbackend.go:86-121`; `backend_v1.go:32-65`; `backend_v2.go:29-45`; `tnbackend_test.go:302-344`) |
| v1 lifecycle | The v1 adapter has no GET-by-ID, requires a name on create, re-lists after mutations, injects the ID on update, and skips the v2-only pre-delete read. These are provider/SDK lifecycle constraints, not evidence that the v1 and v2 backend lifecycles are interchangeable. (`backend_v1.go:13-30,91-125`; `resources/trusted_network.go:260-318`) |

The refreshed commit also adds `UseStateForUnknown` plan modifiers for `hostname` and `ssid`; that is a Terraform planning change, not a server-side contract correction. The unresolved questions remain whether a 400/403 probe response means endpoint absence or an ordinary API error, what the v1/v2 `conditionType` values mean on a live tenant, and whether the two endpoint families share backing state. See [`./trusted-networks.md`](./trusted-networks.md) and [`./api-divergences.md`](./api-divergences.md) for the retained contract boundary.

## Coverage boundaries

Source: `vendor/terraform-provider-zcc/docs/index.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_notification_template.md`.

The provider is useful as an automation and schema signal, but it is not complete product coverage. The provider docs say provider parity follows publicly available API endpoints; UI-only fields may not appear until a public API exists.

Current pinned provider gaps that matter for reasoning:

- **Acceptable Use Policy (AUP):** no `zcc_*_aup` resource or data source exists in the pinned provider. See [`./acceptable-use-policy.md`](./acceptable-use-policy.md).
- **Legacy ZCC auth:** unsupported by the Terraform provider even though the Python SDK still documents a legacy ZCC client path. Use OneAPI / ZIdentity for Terraform.
- **Notification templates are not the same as AUP:** `zcc_notification_template` manages ZIA/ZPA/app update/service status notification toggles, not the AUP frequency/message screen.
