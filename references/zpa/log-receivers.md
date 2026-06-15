---
product: zpa
topic: "log-receivers"
title: "ZPA Log Receivers — LSS configuration and architecture"
content-type: reasoning
last-verified: "2026-06-15"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/about-log-streaming-service.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/lss.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_client_types.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go"
  - "vendor/terraform-provider-zpa/zpa/validator.go"
author-status: draft
---

# ZPA Log Receivers — LSS configuration and architecture

## What the Log Streaming Service is

Source: `vendor/zscaler-help/about-log-streaming-service.md`; `vendor/zscaler-sdk-python/zscaler/zpa/lss.py`; `vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py`.

The Log Streaming Service (LSS) is ZPA's mechanism for forwarding operational logs to external destinations — SIEMs, log aggregators, cloud storage. It is distinct from ZIA's Nanolog Streaming Service (NSS) and operates on a different architecture. (Tier A — vendor/zscaler-help/about-log-streaming-service.md: "While the LSS is used to capture log data about App Connectors and users in Private Access using a log receiver, the Nanolog Streaming Service (NSS) resides in Internet & SaaS (ZIA).")

A **Log Receiver** (`lssConfig` in the API) is the operator-created configuration object that defines where log traffic goes: the TCP/TLS endpoint, the log type it carries, the output format, and optional filter conditions.

**Cloud log retention:** Zscaler retains User Activity, User Status, and App Connector log information for rolling periods of at least 14 days during the subscription term. Audit log information is retained for at least 6-month periods. (Tier A — vendor/zscaler-help/about-log-streaming-service.md.) For access to logs beyond these retention windows, LSS is required.

Three related concepts that are NOT this doc:

| Concept | Doc |
|---|---|
| What fields are in each log record | [`./logs/access-log-schema.md`](./logs/access-log-schema.md) |
| Cross-product log-egress architecture (NSS, VM vs Cloud) | [`../shared/nss-architecture.md`](../shared/nss-architecture.md) |
| Where logs originate (App Connectors) | [`./app-connector.md`](./app-connector.md) |

## LSS architecture

Source: `vendor/zscaler-help/about-log-streaming-service.md`.

LSS is deployed using two components: a log receiver and an App Connector. (Tier A — vendor/zscaler-help/about-log-streaming-service.md: "LSS resides in the Zero Trust Exchange (ZTE) and initiates a log stream through a Public Service Edge for Private Access. The App Connector resides in your company's enterprise environment. It receives the log stream and then forwards it to a log receiver.")

The data flow:
```
ZPA cloud (ZTE) ──► Public Service Edge ──► App Connector ──► Log Receiver (SIEM/syslog endpoint)
```

The App Connector acts as a log forwarder: it receives the log stream from ZPA's cloud infrastructure and forwards it to the configured receiver endpoint. This means:
- App Connectors must be deployed before configuring log receivers.
- The log receiver endpoint must be reachable from the App Connector's network, not from the internet.
- Log receiver capacity limits are determined by the App Connector's throughput and network path, not by a Zscaler-side quota.

## Log receiver configuration shape

A Log Receiver object has three top-level blocks.

### `config` — connection and stream definition

Source: `vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py`; `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go`.

| Field (Python SDK) | Wire JSON key | TF attribute | Notes |
|---|---|---|---|
| `lss_host` | `lssHost` | `lss_host` | IP or hostname of the receiving SIEM / syslog endpoint. Required. |
| `lss_port` | `lssPort` | `lss_port` | TCP port. Required. String type on the wire. |
| `use_tls` | `useTls` | `use_tls` | Boolean. Enables TLS on the log stream. Default `false`. |
| `source_log_type` | `sourceLogType` | `source_log_type` | Internal log type code (see table below). Required. |
| `format` | `format` | `format` | The log stream content template string. Required. |
| `filter` | `filter` | `filter` | List of session status code strings to exclude. Log-type dependent. |
| `enabled` | `enabled` | `enabled` | Boolean. Default `true`. |
| `name` | `name` | `name` | Human-readable label. Required. |
| `description` | `description` | `description` | Optional free-text. |
| `audit_message` | `auditMessage` | `audit_message` | Computed audit field. |

### `connector_groups` — App Connector Group affinity

Source: `vendor/zscaler-sdk-python/zscaler/zpa/lss.py`; `vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py`.

A list of App Connector Group IDs. Scopes which connectors participate in this log stream. The Python SDK accepts a list of group ID strings via `app_connector_group_ids`.

### `policy_rule_resource` — log filter policy

Source: `vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py`; `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go`.

An optional policy rule that gates which sessions/events are forwarded. Uses the same condition/operand structure as ZPA access policy but with a restricted set of `object_type` values (see Filtering below).

## Log types

Source: `vendor/zscaler-sdk-python/zscaler/zpa/lss.py`; `vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go`; `vendor/zscaler-help/about-log-streaming-service.md`.

The Python SDK `source_log_map` and the TF data source `data_source_zpa_lss_config_log_types_formats.go` define the full set. (Tier A — vendor/zscaler-help/about-log-streaming-service.md:44-55 lists exactly 12 human-facing log types.)

| Internal code | Human label | SDK `source_log_type`? | Notes |
|---|---|---|---|
| `zpn_trans_log` | User Activity | Yes | Per-connection records; the primary "access log" stream. See [`./logs/access-log-schema.md`](./logs/access-log-schema.md). |
| `zpn_auth_log` | User Status | Yes | User auth/enrollment events. |
| `zpn_ast_auth_log` | App Connector Status | Yes | Connector availability and connection to ZPA. |
| `zpn_ast_comprehensive_stats` | App Connector Metrics | Yes | Per-connector telemetry and metrics. |
| `zpn_http_trans_log` | Browser Access Logs | Yes | HTTP log records for Browser Access sessions. |
| `zpn_audit_log` | Audit Logs | Yes | Admin Console session and change history. |
| `zpn_sys_auth_log` | Private Service Edge Status | Yes | PSE availability and connection events. |
| `zpn_pbroker_comprehensive_stats` | Private Service Edge Metrics | No (SDK); **Yes (TF resource)** | PSE telemetry. The Terraform resource `zpa_lss_config_controller` accepts this code as a live `source_log_type` (`vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:225`); it is absent from the Python SDK `source_log_map`. |
| `zpn_waf_http_exchanges_log` | AppProtection (Web Inspection) | Yes | App Protection policy activity. SDK key is `web_inspection`. |
| `zms_flow_log` | Microsegmentation | No (SDK); unresolved (zpa-41) | Microsegmentation Flow activity. Present in TF data source (format lookup) but absent from TF resource write validator; receiver-API acceptance unconfirmed. |
| `zpn_sitec_comprehensive_stats` | Private Cloud Controller Metrics | No (SDK); unresolved (zpa-41) | Private Cloud Controller telemetry. Present in TF data source (format lookup) and Postman format-lookup; absent from TF resource write validator; receiver-API acceptance unconfirmed. |
| `zpn_sitec_auth_log` | Private Cloud Controller Status | No (SDK); unresolved (zpa-41) | Private Cloud Controller availability. Present in TF data source (format lookup) and Postman format-lookup; absent from TF resource write validator; receiver-API acceptance unconfirmed. |
| `zpn_auth_log_1id` | User Status (Zidentity) *(inferred — see Open questions)* | No (SDK); unresolved (zpa-41) | Zidentity-era variant of the User Status log. Present in TF data source (format lookup); absent from TF resource write validator; receiver-API acceptance unconfirmed. |
| `zpn_smb_inspection_log` | (SMB inspection) | No (SDK); unresolved (zpa-41) | SMB inspection log. Present in TF data source (format lookup); absent from TF resource write validator; receiver-API acceptance unconfirmed. |
| `zpn_ldap_inspection_log` | (LDAP inspection) | No (SDK); unresolved (zpa-41) | LDAP inspection log. Present in TF data source (format lookup); absent from TF resource write validator; receiver-API acceptance unconfirmed. |
| `zpn_krb_inspection_log` | (Kerberos inspection) | No (SDK); unresolved (zpa-41) | Kerberos inspection log. Present in TF data source (format lookup); absent from TF resource write validator; receiver-API acceptance unconfirmed. |

(Tier A — Python `source_log_map`: vendor/zscaler-sdk-python/zscaler/zpa/lss.py:27-36; TF data source code set: vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go:21-38; human labels: vendor/zscaler-help/about-log-streaming-service.md:44-55.)

**Two code sets, two purposes.** The Python SDK `source_log_map` maps exactly **8** human-readable keys to internal codes — `app_connector_metrics` → `zpn_ast_comprehensive_stats`, `app_connector_status` → `zpn_ast_auth_log`, `audit_logs` → `zpn_audit_log`, `browser_access` → `zpn_http_trans_log`, `private_svc_edge_status` → `zpn_sys_auth_log`, `user_activity` → `zpn_trans_log`, `user_status` → `zpn_auth_log`, `web_inspection` → `zpn_waf_http_exchanges_log` (vendor/zscaler-sdk-python/zscaler/zpa/lss.py:27-36). Those 8 are the codes the SDK will accept on a receiver's `source_log_type`. The TF data source enumerates **16** codes (vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go:21-38), but that list validates the `log_type` argument to the format-lookup data source only (`GET /lssConfig/logType/formats`). The 8 extra codes — `zpn_pbroker_comprehensive_stats`, `zms_flow_log`, `zpn_sitec_comprehensive_stats`, `zpn_sitec_auth_log`, `zpn_auth_log_1id`, `zpn_smb_inspection_log`, `zpn_ldap_inspection_log`, `zpn_krb_inspection_log` — are valid for format lookups but absent from the Python SDK's `source_log_map`. The one exception is `zpn_pbroker_comprehensive_stats`, which the **Terraform resource** `zpa_lss_config_controller` additionally accepts as a live `source_log_type` (`vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:225`) — so it is a confirmed streamable code via TF, just not via the Python SDK. The remaining 7 — `zms_flow_log`, `zpn_sitec_comprehensive_stats`, `zpn_sitec_auth_log`, `zpn_auth_log_1id`, `zpn_smb_inspection_log`, `zpn_ldap_inspection_log`, `zpn_krb_inspection_log` — appear only in the format-lookup set and the TF resource write validator does not include them; whether the ZPA API accepts them on a live receiver's `sourceLogType` is unresolved (see [zpa-41](../_meta/clarifications.md#zpa-41-format-only-log-type-codes-acceptance-on-a-receivers-sourcelogtype)).

## Output formats

Source: `vendor/zscaler-sdk-python/zscaler/zpa/lss.py`; `vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go`; `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go`.

The API exposes pre-configured format templates per log type, retrievable via `GET /lssConfig/logType/formats`. Each log type supports **csv**, **json**, and **tsv** variants. The Python SDK defaults to `csv` when no `log_stream_content` override is provided; the TF provider requires the operator to supply the format string explicitly (typically fetched via the `zpa_lss_config_log_type_formats` data source).

Custom log stream content can be supplied as a raw template string, overriding the built-in format. See [`./logs/access-log-schema.md`](./logs/access-log-schema.md) for the field reference and format specifiers (`%s{Field}`, `%d{Field}`, `%j{Field}`, etc.).

## Delivery guarantee model

Source: `vendor/zscaler-help/about-log-streaming-service.md`.

(Tier A — vendor/zscaler-help/about-log-streaming-service.md.)

**At-least-once with a 15-minute retransmit window:**
- The LSS does not transmit any log data generated during a connection loss between ZPA and the App Connectors.
- After the connection is restored, LSS can retransmit the last **15 minutes** of log data. Delivery of that data is not guaranteed.
- With the exception of audit log data, the LSS does not transmit any log data generated during a connection loss between the App Connector and the SIEM.

This is **not** a guaranteed-delivery system. A sustained connector outage (>15 minutes) creates a permanent log gap. Audit logs receive special handling — the help doc implies audit logs may have a different (better) recovery path, but the exact mechanism is not detailed in available sources.

The 15-minute window is shorter than the ZIA NSS opt-in 60-minute recovery window. Plan monitoring and alerting accordingly.

## Filtering criteria

Source: `vendor/terraform-provider-zpa/zpa/validator.go`; `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go`.

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

## TLS certificate handling

Source: `vendor/zscaler-help/about-log-streaming-service.md`; `vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py`; `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go`.

(Tier A — vendor/zscaler-help/about-log-streaming-service.md.)

LSS supports mutual TLS encryption between the log receiver and the App Connector. TLS requirements:

**Log receiver requirements:**
- Supports TLS communication.
- Has a client certificate for mutual TLS that uses a public root CA.
- Must validate the chain of trust to the App Connector's enrollment certificate — add the App Connector's enrollment certificate to the log receiver's trust store.

**App Connector behavior:**
- Automatically receives a root certificate during deployment.
- Trusts log receiver certificates signed by global public root CAs, or signed by custom root CAs used as the App Connector's enrollment certificate.

The `use_tls` flag in the log receiver config enables TLS on the outbound stream. No CA certificate or peer verification field is exposed in the SDK or TF schema — TLS trust configuration happens outside the Log Receiver object. There is no SDK surface for pinning a specific CA via the Log Receiver object configuration. The Python `LSSConfig` model carries only a `useTls` boolean and no CA/peer-verification attribute (vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py:122,159), matching the Go `LSSConfig` struct's `UseTLS bool`-only surface (vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:43).

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
| Get client types | `GET` | `/zpa/mgmtconfig/v2/admin/lssConfig/customers/{customerId}/clientTypes` (Python, customer-scoped) — the Go SDK calls a non-customer-scoped path `/zpa/mgmtconfig/v2/admin/lssConfig/clientTypes` instead; see [`./api-divergences.md`](./api-divergences.md) → "GetClientTypes endpoint path". |

Source: `vendor/zscaler-sdk-python/zscaler/zpa/lss.py`; `vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_client_types.go:11`. The Go SDK uses the non-customer-scoped path `lssConfig/clientTypes` (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_client_types.go:11`) while the Python customer-scoped path is the recommended replacement; the divergence is detailed in [`./api-divergences.md`](./api-divergences.md) → "GetClientTypes endpoint path".

**SDK service** (`client.zpa.lss`): `list_configs`, `get_config`, `add_lss_config`, `update_lss_config`, `delete_lss_config`, `get_log_formats`, `get_client_types`, `get_status_codes`. Uses the v2 endpoint `/zpa/mgmtconfig/v2/admin/customers/{customer_id}/lssConfig`. (Tier A — sdk.md §2.22.)

`add_lss_config` signature: `(lss_host, lss_port, name, source_log_type, app_connector_group_ids=None, enabled=True, source_log_format="csv", use_tls=False, **kwargs)`.

Source: `vendor/zscaler-sdk-python/zscaler/zpa/lss.py`.

`update_lss_config` in zscaler-sdk-python v1.9.30 builds a partial PUT payload from caller-supplied fields and omits unprovided `policyRule` / `policyRuleResource` data. That matters for receivers with attached SIEM policy filters: older SDK behavior could round-trip fetched policy objects and fail non-policy updates with `policy.invalid.mapping.input`. If an LSS receiver rename or endpoint-only update fails that way, upgrade to v1.9.30 or later. Upstream issue [zscaler/zscaler-sdk-python#514](https://github.com/zscaler/zscaler-sdk-python/issues/514) tracks the fixed behavior.

## Operational gotchas

Source: `vendor/zscaler-help/about-log-streaming-service.md`; `vendor/zscaler-sdk-python/zscaler/zpa/lss.py`; `vendor/terraform-provider-zpa/zpa/validator.go`.

**1. Connector groups required for log sourcing.**
If `connector_groups` is empty, the receiver has no source connectors and will emit nothing. The Python SDK `add_lss_config` accepts `app_connector_group_ids=None` without error, but the resulting receiver is non-functional until connector groups are added.

**2. Retransmit window is 15 minutes.**
A sustained connector outage creates a permanent log gap. This is shorter than the NSS opt-in 60-minute recovery window. Plan alert thresholds and SIEM parsing for gaps.

**3. `source_log_type` changes require format string update.**
The Python SDK `update_lss_config` accepts `source_log_type` and will re-fetch the format template for the new type. Changing the log type on an existing receiver without also updating the `format` string produces a mismatch: the receiver streams data in the new type's schema but the SIEM parser still expects the old format. Update both atomically.

**4. Multi-receiver fan-out creates resource duplication.**
There is no single-receiver fan-out. Each Log Receiver streams to exactly one `(lssHost, lssPort)` target. To send the same log type to two SIEMs, create two Log Receiver objects with identical configurations targeting different endpoints. Both objects consume connector resources independently.

**5. Filter codes are log-type-specific and validated at plan time.**
Passing a status code from one log type's filter list to a receiver configured for a different log type fails at TF plan time via `validateLSSConfigControllerFilters`. The valid status codes are available via `GET /lssConfig/statusCodes` (Python: `zpa.lss.get_status_codes(log_type=<type>)`).

**6. Log receiver endpoint must be reachable from App Connector network.**
The SIEM or log receiver is targeted by the App Connector, not by Zscaler's cloud. The endpoint must be accessible from wherever the App Connector runs — typically inside the corporate network or a cloud VPC. Internet-exposed SIEM endpoints work if the App Connector has outbound internet access.

**7. Deception-configured receivers are read-only.**
If a log receiver is configured using Zscaler Deception, the copy, edit, and delete options are unavailable in the Admin Console. (Tier A — vendor/zscaler-help/about-log-streaming-service.md.)

**8. Receiver capacity limits.**
The help doc does not publish explicit per-receiver throughput limits. Capacity is constrained by App Connector CPU/network and the log receiver's ingestion capacity. High-volume tenants (many users, dense access patterns) may need to distribute log types across multiple receivers or increase App Connector resources.

## Admin Console

Logs > Log Streaming > Log Receivers. Per-receiver columns: Name, Domain Name or IP Address, TCP Port, TLS Encryption, Log Type. Supports copy (clone configuration), edit, delete. (Tier A — vendor/zscaler-help/about-log-streaming-service.md.)

## Open questions

- **`zpn_auth_log_1id` human label.** The TF data source lists `zpn_auth_log_1id` as a valid format-lookup code (vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go:32), but no source maps it to a human-facing label. The "User Status (Zidentity)" label in the Log types table is inferred from the `auth_log` stem plus the `_1id` suffix (Zidentity / "OneID") and is not directly confirmed — the help doc's 12 labels (vendor/zscaler-help/about-log-streaming-service.md:44-55) list only a single "User Status" with no Zidentity variant. Confirm the operator-facing name before relying on it. (Tracked as [`zpa-40`](../_meta/clarifications.md#zpa-40-zpn_auth_log_1id-human-facing-label).)
- **Format-only codes' receiver acceptance.** `zpn_pbroker_comprehensive_stats` is established as a live `source_log_type` — the TF resource `zpa_lss_config_controller` validates it (`resource_zpa_lss_config_controller.go:225`), strong evidence the API accepts it on a receiver. For the remaining 7 codes present in the TF format-lookup set but absent from both the Python `source_log_map` and the TF resource's `source_log_type` set (`zms_flow_log`, `zpn_sitec_comprehensive_stats`, `zpn_sitec_auth_log`, `zpn_auth_log_1id`, `zpn_smb_inspection_log`, `zpn_ldap_inspection_log`, `zpn_krb_inspection_log`), whether the ZPA API rejects them on a receiver's `sourceLogType` (vs. the Python SDK simply not exposing a key) is not established in available sources — the SDK validates against its own map, not a server response. (Tracked as [`zpa-41`](../_meta/clarifications.md#zpa-41-format-only-log-type-codes-acceptance-on-a-receivers-sourcelogtype).)

## Cross-links

- Log record field schemas (what's in each log type) — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- Cross-product log-egress architecture (NSS vs LSS, retry behavior) — [`../shared/nss-architecture.md`](../shared/nss-architecture.md)
- App Connectors (where ZPA logs originate) — [`./app-connector.md`](./app-connector.md)
- LSSConfigControllerAPI in SDK catalog — [`./sdk.md`](./sdk.md) §2.22
