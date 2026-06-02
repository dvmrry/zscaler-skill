---
product: zcc
topic: "zcc-terraform"
title: "ZCC Terraform provider — resource and data-source surface"
content-type: reference
last-verified: "2026-06-02"
verified-against:
  vendor/terraform-provider-zcc: 76f0f4933752a4bead4055de2c3fcda48dc7b22e
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
author-status: draft
---

# ZCC Terraform provider — resource and data-source surface

The `zscaler/zcc` Terraform provider manages a subset of Zscaler Client Connector configuration through the ZCC public API. The pinned provider authenticates through OneAPI / ZIdentity and does not expose the older legacy ZCC V2 client path.

Source: `vendor/terraform-provider-zcc/docs/index.md`.

## Provider authentication

The provider uses the standard OneAPI credential shape:

| Provider argument | Environment variable | Notes |
|---|---|---|
| `client_id` | `ZSCALER_CLIENT_ID` | OAuth client ID from ZIdentity. |
| `client_secret` | `ZSCALER_CLIENT_SECRET` | Conflicts with `private_key`. |
| `private_key` | `ZSCALER_PRIVATE_KEY` | Alternative OAuth private-key auth. |
| `vanity_domain` | `ZSCALER_VANITY_DOMAIN` | Tenant vanity domain. |
| `zscaler_cloud` | `ZSCALER_CLOUD` | Optional; required for non-default clouds such as beta. |

The provider docs explicitly state that legacy `zcc_client_id` / `zcc_client_secret` / `zcc_cloud` authentication is not supported.

Source: `vendor/terraform-provider-zcc/docs/index.md`.

## Resource catalog

| Terraform resource | ZCC surface | Notes |
|---|---|---|
| `zcc_forwarding_profile` | Forwarding profile | Manages trusted-network matching and per-network ZIA/ZPA/unified-tunnel forwarding actions. |
| `zcc_trusted_network` | Trusted network | Manages named trusted-network criteria used by forwarding profiles. |
| `zcc_failopen_policy` | Fail-open policy | Manages fail-open and captive-portal behavior. |
| `zcc_device_cleanup` | Device cleanup policy | Manages enrolled-device cleanup settings. |
| `zcc_web_privacy` | Web privacy | Manages endpoint privacy/logging collection flags. |
| `zcc_zia_posture` | ZIA posture profile | Manages device posture profiles and trust-tier criteria evaluated by Client Connector. |
| `zcc_notification_template` | Notification template | Manages end-user notification templates and per-service ZIA/ZPA notification toggles. |

Source: `vendor/terraform-provider-zcc/docs/resources/zcc_forwarding_profile.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_trusted_network.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_failopen_policy.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_device_cleanup.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_web_privacy.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_zia_posture.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_notification_template.md`.

## Data-source catalog

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

Source: `vendor/terraform-provider-zcc/docs/data-sources/zcc_forwarding_profile.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_trusted_network.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_failopen_policy.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_device_cleanup.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_web_privacy.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_zia_posture.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_notification_template.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_devices.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_admin_user.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_admin_roles.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_company_info.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_custom_ip_apps.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_predefined_ip_apps.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_process_based_apps.md`; `vendor/terraform-provider-zcc/docs/data-sources/zcc_web_app_service.md`.

## Coverage boundaries

The provider is useful as an automation and schema signal, but it is not complete product coverage. The provider docs say provider parity follows publicly available API endpoints; UI-only fields may not appear until a public API exists.

Current pinned provider gaps that matter for reasoning:

- **Acceptable Use Policy (AUP):** no `zcc_*_aup` resource or data source exists in the pinned provider. See [`./acceptable-use-policy.md`](./acceptable-use-policy.md).
- **Legacy ZCC auth:** unsupported by the Terraform provider even though the Python SDK still documents a legacy ZCC client path. Use OneAPI / ZIdentity for Terraform.
- **Notification templates are not the same as AUP:** `zcc_notification_template` manages ZIA/ZPA/app update/service status notification toggles, not the AUP frequency/message screen.

Source: `vendor/terraform-provider-zcc/docs/index.md`; `vendor/terraform-provider-zcc/docs/resources/zcc_notification_template.md`.
