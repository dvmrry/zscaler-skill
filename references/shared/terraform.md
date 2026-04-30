---
product: shared
topic: "terraform-provider"
title: "Zscaler Terraform providers (ZIA + ZPA)"
content-type: reference
last-verified: "2026-04-23"
confidence: medium
source-tier: mixed
sources:
  - "https://registry.terraform.io/providers/zscaler/zia/latest/docs"
  - "vendor/terraform-provider-zia/docs/index.md"
  - "vendor/terraform-provider-zia/README.md"
  - "https://registry.terraform.io/providers/zscaler/zpa/latest/docs"
  - "vendor/terraform-provider-zpa/docs/index.md"
  - "vendor/terraform-provider-zpa/README.md"
author-status: draft
---

# Zscaler Terraform providers (ZIA + ZPA)

The two separate Zscaler providers — `zscaler/zia` and `zscaler/zpa` — mapped to the API endpoints covered in this skill. Derived from the vendored provider repositories (`vendor/terraform-provider-zia`, `vendor/terraform-provider-zpa`).

## Provider declaration

ZIA (per `vendor/terraform-provider-zia/docs/index.md`):

```hcl
terraform {
  required_providers {
    zia = {
      version = "~> 4.0.0"
      source  = "zscaler/zia"
    }
  }
}

provider "zia" {
  client_id     = "[ZSCALER_CLIENT_ID]"
  client_secret = "[ZSCALER_CLIENT_SECRET]"
  vanity_domain = "[ZSCALER_VANITY_DOMAIN]"
  zscaler_cloud = "[ZSCALER_CLOUD]"
}
```

ZPA follows the identical pattern — substitute `zscaler/zpa` and the matching provider block.

## Auth — OneAPI vs legacy

Both providers support two auth frameworks, same as the SDK. From `vendor/terraform-provider-zia/docs/index.md`:

- **OneAPI (v4.0.0+)** — OAuth 2.0 Client Credentials flow via ZIdentity. Recommended for new deployments.
- **Legacy** — provider-specific API keys + username/password. Required for tenants not migrated to ZIdentity, and for gov clouds (`zscalergov`, `zscalerten` for ZIA; `GOV`, `GOVUS` for ZPA — OneAPI is not supported in these).

Environment variables (OneAPI mode):

| TF Argument | Env Variable | Notes |
|---|---|---|
| `client_id` | `ZSCALER_CLIENT_ID` | Zscaler API Client ID |
| `client_secret` | `ZSCALER_CLIENT_SECRET` | Secret-based auth |
| `private_key` | `ZSCALER_PRIVATE_KEY` | JWT private-key auth (alternative to secret) |
| `vanity_domain` | `ZSCALER_VANITY_DOMAIN` | Organization's ZIdentity domain |
| `zscaler_cloud` | `ZSCALER_CLOUD` | Optional; for alternative environments (e.g. `beta`) |

Per index.md: "Hard-coding credentials into any Terraform configuration is not recommended, and risks secret leakage should this file be committed to public version control."

## Feature parity caveat

From `vendor/terraform-provider-zia/docs/index.md`:

> The ZIA Terraform provider maintain parity with publicly available API endpoints. In some instances, certain features or attributes available via the Zscaler UI may not be immediately available through the API, and therefore cannot be included in the Terraform provider.

Translation: **UI features visible in the Zscaler Admin Console may not be manageable via Terraform** until Zscaler exposes the corresponding public API. File a feature request if you hit a gap.

## Resource map by policy area

### URL Categories & URL Filtering (ZIA)

- `zia_url_categories` — custom URL categories, keywords, IP ranges
- `zia_url_filtering_rules` — URL filtering policy rules (order-sensitive; `order` field is meaningful)
- `zia_activation_status` — runs `POST /status/activate` during a Terraform apply

### Cloud App Control (ZIA)

- `zia_cloud_app_control_rule` — Cloud App Control rules. Rule type (URL_FILTERING / CLOUD_APP_CONTROL / ...) is part of the resource identity; changing type requires recreating the resource.
- `zia_cloud_application_instance` — discovered cloud-app instances (level 1/2/3 instance hierarchy; see `web-log-schema.md` for the matching log fields)

### SSL Inspection (ZIA)

- `zia_ssl_inspection_rules` (exact name verified in `vendor/terraform-provider-zia/docs/resources/`)

### Advanced settings (ZIA)

- `zia_advanced_settings` — the Advanced Policy Settings page (cascading, AI/ML categorization, SafeSearch, UCaaS one-click, M365 one-click toggles)
- `zia_advanced_threat_settings` — ATP-adjacent settings

### DLP (ZIA)

- `zia_dlp_web_rules`
- `zia_dlp_dictionaries`
- `zia_dlp_engines`
- `zia_dlp_notification_templates`

### NSS feed config (ZIA — log streaming)

- `zia_cloud_nss_feed` — Cloud NSS feed definition
- Fields map to NSS format specifiers documented in [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md) / firewall / dns

### Application Segments (ZPA)

- `zpa_application_segment` — the canonical defined-application segment
- `zpa_application_segment_browser_access` — Browser Access variant
- `zpa_application_segment_inspection` — AppProtection variant
- `zpa_application_segment_pra` — Privileged Remote Access variant
- `zpa_application_segment_multimatch_bulk` — bulk Multimatch INCLUSIVE/EXCLUSIVE updates (see [`../zpa/app-segments.md`](../zpa/app-segments.md))
- `zpa_application_segment_weightedlb_config` — load-balancing config

### Segment Groups / Server Groups / App Connectors (ZPA)

- `zpa_segment_group`
- `zpa_server_group`
- `zpa_app_connector_group`
- `zpa_app_connector_assistant_schedule`

### Access Policy (ZPA)

- `zpa_policy_access_rule` — the core access policy rule resource
- `zpa_policy_access_rule_application_segment` — segment-attach variant (see resource docs for the distinction)

### LSS / log streaming (ZPA)

Per-log-type resources mirror the log templates documented in [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md):

| TF Resource | Log Type |
|---|---|
| `zpa_lss_config_user_activity` | User Activity |
| `zpa_lss_config_user_status` | User Status |
| `zpa_lss_config_controller` | Generic LSS config controller |
| `zpa_lss_app_connector_metrics` | App Connector metrics |
| `zpa_lss_app_connector_status` | App Connector status |
| `zpa_lss_private_service_metrics` | Private Service Edge metrics |
| `zpa_lss_private_service_edge_status` | Private Service Edge status |
| `zpa_lss_audit_logs` | Admin audit |
| `zpa_lss_app_protection` | AppProtection |
| `zpa_lss_web_browser` | Browser Access |

### Microtenants (ZPA)

- `zpa_microtenant_controller` — microtenant scope configuration
- Some features are not microtenant-supported (e.g. Extranet settings per *Configuring Defined Application Segments* p.19)

### Emergency Access / Cloud Browser Isolation (ZPA)

- `zpa_emergency_access_user`
- `zpa_cloud_browser_isolation_banner`, `..._certificate`, `..._external_profile`

## Data sources

Both providers expose data sources that mirror most of their resources — see `vendor/terraform-provider-zia/docs/data-sources/` and `vendor/terraform-provider-zpa/docs/data-sources/`. These enable reading existing config without managing it (e.g., reference an existing segment group by ID in a new rule).

## Things not managed via these providers

From the feature-parity caveat above, plus direct observation:

- **Log data** (access logs, firewall logs, DNS logs, LSS log streams) — consumed via NSS / LSS runtime, not through Terraform. Use `zia_cloud_nss_feed` / `zpa_lss_config_*` for *configuration* of the streaming, not for reading log data.
- **Tenant data snapshots** — no Terraform export of the live config state beyond the standard `terraform show` + state file. Use the SDK or direct API for bulk snapshot.
- **Admin audit log viewing** — configuring audit streaming is TF-manageable; reading the stream is not.
- **Deception policies** (`zpa-07`) — Zscaler Deception module resources are likely in the provider but with limited edit/copy/delete per *About Access Policy* p.6. See vendor docs for current status.

## Handy companion tool

`zscaler/zscaler-terraformer` (separate repo at `https://github.com/zscaler/zscaler-terraformer`) converts an existing Zscaler tenant's configuration into Terraform HCL — useful for onboarding an existing tenant into Terraform management without hand-writing every resource.

## Schema patterns worth knowing

The TF providers encode API-behavior constraints that help docs and even the Python SDK don't surface. These apply broadly across resources — worth knowing before asking "why did my plan show a diff?" or "why did Terraform destroy-recreate this?".

### `DiffSuppressFunc` reveals API-side normalization

- **Multi-line text is normalized.** Virtually every ZIA resource (URL filtering, DLP, SSL, firewall, CASB, bandwidth, file-type, sandbox, forwarding) applies `noChangeInMultiLineText` to `description` / `notes` fields. The API normalizes whitespace and line endings server-side; Terraform suppresses spurious diffs. If a plan shows a description diff that "looks right," it's likely a whitespace nit the API accepted as-is. Useful when skill operators compare expected vs actual config.
- **Coordinates normalize to 6 decimals.** `latitude` / `longitude` on App Connector Group, Service Edge Group, and Private Cloud Group use `DiffSuppressFuncCoordinate` (`terraform-provider-zpa/zpa/utils.go:36-41`). Higher-precision inputs are rounded server-side. A lat/long change below 6 decimals will not plan as a diff.
- **Service Edge Group `service_edges` membership is externally managed.** The field's `DiffSuppressFunc` fully suppresses diffs unless it's explicitly set in config (`resource_zpa_service_edge_group.go:132-139`). The provider comments note the field will be deprecated. Do not recommend setting it in HCL.

### `ForceNew` fields — destroy-recreate on change

These fields on ZIA/ZPA resources are immutable at the API level. Changing them in Terraform triggers resource destruction and re-creation, which means downtime and (for policy rules) potential policy-order renumbering:

**ZIA:**
- VPN credentials — `type`, `fqdn`, `ip_address`, `pre_shared_key` all `ForceNew` (`resource_zia_traffic_forwarding_vpn_credentials.go:77, 87, 93, 99`). Rotating a PSK or migrating from IP to UFQDN requires full credential recreation.

**ZPA:**
- Application Segments (all variants) — `select_connector_close_to_app` is `ForceNew`. Toggling connector-proximity routing requires segment recreation.
- Policy Access rules — `reauth_timeout` and `reauth_idle_timeout` are both `ForceNew` (`common.go:554-562`). **Changing a session/idle timeout on an existing rule requires destroy-recreate** — the API refuses in-place updates. This can renumber nearby rules; plan carefully.

### Validator enums richer than help docs

In many cases, the TF schema's `validation.StringInSlice([]string{...}, false)` encodes a fuller enum than the help-site docs. Treat the TF validator as more authoritative when they conflict. Examples in `references/zia/api.md` and `references/zpa/api.md` per-resource sections.

### Programmatic constraints beyond schema

Some mutual-exclusions live in resource `Create` / `Update` functions rather than in the schema — not visible from a schema dump:

- **Browser Access app segments**: setting `certificate_id` while `ext_label` or `ext_domain` is configured is rejected in code (`resource_zpa_application_segment_browser_access.go:43-50`).
- **Server Group `servers` required when `dynamic_discovery = false`** — enforced at Create/Update, not via `RequiredWith` in schema (`resource_zpa_server_group.go:214, 283-284`).

### Explicit schema-level mutual exclusions

`ExactlyOneOf` and `ConflictsWith` show up in a few high-value places:

- **Policy Credential Access rules**: `ExactlyOneOf: ["credential", "credential_pool"]` — must set exactly one (`resource_zpa_policy_credential_access_rule.go:125, 138`).
- **Service Edge Group grace distance**: `grace_distance_value`, `grace_distance_value_unit`, `grace_distance_enabled` all form a `RequiredWith` triplet — set all three or none (`resource_zpa_service_edge_group.go:224, 245`).
- **Auth credentials** (both providers): `client_secret` conflicts with `private_key` — use one auth method per provider instance.

## Cross-links

- ZIA API structure (auth, activation, endpoint catalog) — [`../zia/api.md`](../zia/api.md)
- ZPA API structure — [`../zpa/api.md`](../zpa/api.md)
- URL filtering behavior — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA app segments — [`../zpa/app-segments.md`](../zpa/app-segments.md)
