---
product: zpa
topic: "log-receivers"
title: "ZPA Log Receivers — LSS configuration primitive (sourced from SDK / TF; help portal gap)"
content-type: reasoning
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zpa/lss.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go"
  - "vendor/terraform-provider-zpa/zpa/validator.go"
author-status: draft
---

# ZPA Log Receivers — LSS configuration primitive

> **Source gap — help portal non-functional.** As of April 2026, the Zscaler help-portal page for ZPA Log Receivers / LSS configuration returns 404. This document is sourced entirely from the Python SDK (`lss.py`, `models/lss.py`) and the Terraform provider (`resource_zpa_lss_config_controller.go`, `validator.go`, `data_source_zpa_lss_config_log_types_formats.go`). Treat all field-level detail as **confidence: medium** — no authoritative help-portal description could be cross-checked.

## What a Log Receiver is

A **Log Receiver** (API resource type: `lssConfig`) is the LSS configuration primitive that defines *where* ZPA log traffic goes: the TCP/TLS endpoint, the log type it carries, the output format, and optional filter conditions. It is operator-created and operator-managed — distinct from the log records themselves.

Three related concepts that are NOT this doc:

| Concept | Doc |
|---|---|
| What fields are in each log record | [`./logs/access-log-schema.md`](./logs/access-log-schema.md) |
| Cross-product log-egress architecture (NSS, VM vs Cloud) | [`../shared/nss-architecture.md`](../shared/nss-architecture.md) |
| Where logs originate (App Connectors) | [`./app-connector.md`](./app-connector.md) |

LSS is a **ZPA-specific streaming layer** — it is not NSS, does not share configuration with ZIA feeds, and runs a different retry/recovery model (15-minute retransmit window vs NSS's opt-in 60 minutes; see `nss-architecture.md § ZPA LSS retransmit window`).

## Configuration shape

A Log Receiver object has three top-level blocks.

### `config` — connection and stream definition

| Field (Python SDK) | Wire JSON key | TF attribute | Notes |
|---|---|---|---|
| `lss_host` | `lssHost` | `lss_host` | IP or hostname of the receiving SIEM / syslog endpoint. Required. |
| `lss_port` | `lssPort` | `lss_port` | TCP port. Required. String type on the wire. |
| `use_tls` | `useTls` | `use_tls` | Boolean. Enables TLS on the log stream. Default `false`. |
| `source_log_type` | `sourceLogType` | `source_log_type` | Internal log type code (see table below). Required. |
| `format` | `format` | `format` | The log stream content template string (see Formats below). Required. |
| `filter` | `filter` | `filter` | List of session status code strings to exclude. Log-type dependent. |
| `enabled` | `enabled` | `enabled` | Boolean. Default `true`. |
| `name` | `name` | `name` | Human-readable label. Required. |
| `description` | `description` | `description` | Optional free-text. |
| `audit_message` | `auditMessage` | `audit_message` | Computed audit field. |

### `connector_groups` — App Connector Group affinity

A list of App Connector Group IDs. Scopes which connectors participate in this log stream. The Python SDK accepts a list of group ID strings via `app_connector_group_ids`.

### `policy_rule_resource` — log filter policy

An optional policy rule that gates which sessions/events are forwarded. Uses the same condition/operand structure as ZPA access policy but with a restricted set of `object_type` values (see Filtering below).

## Log types

The Python SDK `source_log_map` (8 human-readable keys) and the TF data source `data_source_zpa_lss_config_log_types_formats.go` (16 `zpn_*` internal codes) together define the full set. The help-portal access-log schema doc identifies 12 canonical LSS types; the additional entries in the TF data source (`zpn_smb_inspection_log`, `zpn_ldap_inspection_log`, `zpn_krb_inspection_log`, `zpn_auth_log_1id`, `zpn_sitec_*`, `zms_flow_log`) are extended/preview types not covered in vendored schema docs.

| Internal code | Human label (Python SDK / validator) |
|---|---|
| `zpn_trans_log` | User Activity |
| `zpn_auth_log` | User Status |
| `zpn_ast_auth_log` | App Connector Status |
| `zpn_ast_comprehensive_stats` | App Connector Metrics |
| `zpn_http_trans_log` | Browser Access |
| `zpn_audit_log` | Audit Logs |
| `zpn_sys_auth_log` | Private Service Edge Status |
| `zpn_pbroker_comprehensive_stats` | Private Service Edge Metrics |
| `zpn_waf_http_exchanges_log` | AppProtection (Web Inspection) |

The TF `resource_zpa_lss_config_controller.go` `ValidateFunc` accepts 9 codes (the above minus `zpn_smb_inspection_log` and others). The extended codes in the log-type-formats data source appear to be fetchable for format lookups but not yet accepted on receiver `source_log_type`.

## Output formats

The API exposes pre-configured format templates per log type, retrievable via `GET /lssConfig/logType/formats`. Each log type supports **csv**, **json**, and **tsv** variants. The Python SDK defaults to `csv` when no `log_stream_content` override is provided; the TF provider requires the operator to supply the format string explicitly (typically fetched via the `zpa_lss_config_log_type_formats` data source).

Custom log stream content can be supplied as a raw template string, overriding the built-in format.

## Filtering criteria

Filter behavior is log-type dependent and validated at the TF provider layer (`validator.go`).

**Status-code filters** (the `filter` list on `config`): supported only for log types that have session lifecycle events:
- `zpn_trans_log` (User Activity) — per-connection outcome codes
- `zpn_auth_log` (User Status) — auth state codes
- `zpn_ast_auth_log` (App Connector Status) — connector auth codes
- `zpn_sys_auth_log` (Private Service Edge Status) — PSE auth codes

The following log types explicitly **do not support** status-code filters: Browser Access, Audit Logs, AppProtection, App Connector Metrics, Private Service Edge Metrics.

**Policy rule filtering** (`policy_rule_resource`): restricts which sessions are streamed. Valid `object_type` values by log type:
- `zpn_trans_log` — `APP`, `APP_GROUP`, `IDP`, `SAML`, `SCIM`, `SCIM_GROUP`, `CLIENT_TYPE`
- `zpn_auth_log` — `IDP`, `SAML`, `SCIM`, `SCIM_GROUP`, `CLIENT_TYPE`
- Other log types — policy rule filtering is not validated/supported in the TF provider

## Operational gotchas

**1. TLS: no cert pinning surface in SDK.** The `use_tls` flag enables TLS on the outbound stream but no CA certificate or peer verification field is exposed in the SDK or TF schema. TLS trust is handled at the ZPA infrastructure layer; operators cannot pin a specific CA via the Log Receiver object. Confirm with Zscaler support if mutual TLS is required.

**2. Retransmit window is 15 minutes, not 60.** On App Connector connectivity loss, LSS can retransmit at most the last 15 minutes of logs after reconnection — and delivery is not guaranteed. This is shorter than the NSS opt-in 60-minute recovery window. A sustained connector outage creates a permanent log gap (see `nss-architecture.md § ZPA LSS retransmit window`).

**3. `source_log_type` is mutable but changes the format contract.** The Python SDK `update_lss_config` accepts `source_log_type` as a keyword arg and will re-fetch the format template for the new type. Changing the log type on an existing receiver without also updating the `format` string produces a mismatch: the receiver streams data in the new type's schema but the SIEM parser still expects the old format. Update both atomically.

**4. Multi-receiver fan-out.** There is no single-receiver fan-out — each Log Receiver streams to exactly one `(lssHost, lssPort)` target. To send the same log type to two SIEMs, create two Log Receiver objects with identical configurations targeting different endpoints. Both objects consume connector resources independently.

**5. Connector group affinity is required for log sourcing.** If `connector_groups` is empty, the receiver has no source connectors and will emit nothing. The Python SDK `add_lss_config` accepts `app_connector_group_ids=None` without error, but the resulting receiver is non-functional until connector groups are added.

**6. Filter codes are log-type-specific and validated at plan time.** Passing a status code from one log type's filter list to a receiver configured for a different log type fails at TF plan time via `validateLSSConfigControllerFilters`. The valid status codes are available via `GET /lssConfig/statusCodes` (Python: `zpa.lss.get_status_codes(log_type=<type>)`).

## API endpoints

| Operation | Method | Endpoint |
|---|---|---|
| List receivers | `GET` | `/zpa/mgmtconfig/v2/admin/customers/{customerId}/lssConfig` |
| Get by ID | `GET` | `/zpa/mgmtconfig/v2/admin/customers/{customerId}/lssConfig/{id}` |
| Create | `POST` | `/zpa/mgmtconfig/v2/admin/customers/{customerId}/lssConfig` |
| Update | `PUT` | `/zpa/mgmtconfig/v2/admin/customers/{customerId}/lssConfig/{id}` |
| Delete | `DELETE` | `/zpa/mgmtconfig/v2/admin/customers/{customerId}/lssConfig/{id}` |
| Get formats | `GET` | `/zpa/mgmtconfig/v2/admin/lssConfig/logType/formats` |
| Get status codes | `GET` | `/zpa/mgmtconfig/v2/admin/lssConfig/statusCodes` |
| Get client types | `GET` | `/zpa/mgmtconfig/v2/admin/lssConfig/customers/{customerId}/clientTypes` |

## Cross-links

- Log record field schemas (what's in each log type) — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- Cross-product log-egress architecture (NSS vs LSS, retry behavior) — [`../shared/nss-architecture.md`](../shared/nss-architecture.md)
- App Connectors (where ZPA logs originate) — [`./app-connector.md`](./app-connector.md)
