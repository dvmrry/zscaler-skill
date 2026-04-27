---
product: zpa
topic: zpa-audit-logs
title: "ZPA Admin Audit Logs"
content-type: reference
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go"
  - "vendor/zscaler-sdk-python/zscaler/zpa/lss.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py"
  - "vendor/zscaler-help/about-log-streaming-service.md"
  - "vendor/zscaler-help/admin-rbac-captures.md"
author-status: draft
---

# ZPA Admin Audit Logs

ZPA records admin actions (configuration changes, admin console sessions) as audit log entries. Unlike ZIA — which has a dedicated `auditlogEntryReport` REST endpoint for pulling a report — ZPA admin audit logs are surfaced through the **Log Streaming Service (LSS)** for continuous delivery to a SIEM, and are accessible via the ZPA Admin Console for interactive review.

This document covers the ZPA audit log surface. Data-plane traffic logs (user activity, user status, app connector status) also flow through LSS but are not covered here. The existing `references/zpa/api.md` covers authentication, base URL structure, and application segment/policy resources.

## What is captured

Per `vendor/zscaler-help/about-log-streaming-service.md` (sourced from `https://help.zscaler.com/zpa/about-log-streaming-service`):

> **Audit Logs**: Session information for all admins accessing the Zscaler Admin Console.

This includes admin login sessions and configuration changes made through the ZPA Admin Console. API-driven changes are also captured, attributed to the API key or service account used.

## Retention

Per `vendor/zscaler-help/about-log-streaming-service.md`:

> Zscaler retains audit log information for at least **6-month periods** during the subscription term.

For audit logs beyond that 6-month window, LSS must be configured to forward logs to a SIEM or long-term storage before they age out of Zscaler's retention.

For comparison: User Activity, User Status, and App Connector logs are retained for rolling periods of at least **14 days**; audit logs get the longer 6-month window.

## LSS delivery guarantee for audit logs

Per `vendor/zscaler-help/about-log-streaming-service.md`:

> With the **exception of audit log data**, the LSS does not transmit any log data generated during a connection loss between the App Connector and the SIEM.

This means audit log data has a stronger delivery guarantee than other LSS log types. After a connection is restored, the LSS can retransmit the last 15 minutes of audit log data. The delivery of that retransmitted data is still described as "not guaranteed," but audit logs are explicitly called out as receiving special treatment during connectivity interruptions.

---

## LSS architecture for audit logs

LSS is the mechanism for streaming ZPA audit logs to a SIEM. It uses two components:

1. **Log receiver** — the SIEM or external log collector (IP or FQDN + TCP port). Optionally uses mutual TLS.
2. **App Connector** — the on-premises connector that receives the log stream from the ZTE and forwards it to the log receiver.

The log receiver is configured in the ZPA Admin Console under Logs > Log Streaming > Log Receivers, and programmatically via the `lssConfig` API and Terraform.

The `source_log_type` value for audit logs is **`zpn_audit_log`**.

### All ZPA LSS log types (for context)

| `sourceLogType` value | Description |
|----------------------|-------------|
| `zpn_trans_log` | User Activity |
| `zpn_auth_log` | User Status |
| `zpn_ast_auth_log` | App Connector Status |
| `zpn_http_trans_log` | Web Browser (Browser Access) |
| `zpn_audit_log` | **Audit Logs** |
| `zpn_sys_auth_log` | Private Service Edge Status |
| `zpn_ast_comprehensive_stats` | App Connector Metrics |
| `zpn_pbroker_comprehensive_stats` | Private Service Edge Metrics |
| `zpn_waf_http_exchanges_log` | ZPA App Protection |

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md`

---

## Terraform: provisioning an LSS audit log receiver

Resource: `zpa_lss_config_controller`

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md`

```hcl
# Retrieve the log format for audit logs
data "zpa_lss_config_log_type_formats" "zpn_audit_log" {
  log_type = "zpn_audit_log"
}

data "zpa_policy_type" "lss_siem_policy" {
  policy_type = "SIEM_POLICY"
}

data "zpa_app_connector_group" "this" {
  name = "Example100"
}

resource "zpa_lss_config_controller" "lss_audit_logs" {
  config {
    name            = "LSS Audit Logs"
    description     = "LSS Audit Logs"
    enabled         = true
    format          = data.zpa_lss_config_log_type_formats.zpn_audit_log.json
    lss_host        = "splunk1.acme.com"
    lss_port        = "5001"
    source_log_type = "zpn_audit_log"
    use_tls         = true
  }
  connector_groups {
    id = [data.zpa_app_connector_group.this.id]
  }
}
```

### Schema — `config` block

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Name of the LSS configuration |
| `format` | Yes | Log format: `JSON`, `CSV`, or `TSV` |
| `lss_host` | Yes | IP or FQDN of the SIEM log receiver |
| `lss_port` | Yes | TCP port of the SIEM log receiver |
| `source_log_type` | Yes | Use `zpn_audit_log` for audit logs |
| `description` | No | Optional description |
| `enabled` | No | Whether the LSS receiver is active |
| `use_tls` | No | Enable mutual TLS encryption to the log receiver |

### Schema — `connector_groups` block

| Argument | Required | Description |
|----------|----------|-------------|
| `id` | Yes | List of App Connector Group IDs that forward logs |

The TLS requirement is that the log receiver's certificate must be signed by a public root CA. The App Connector automatically receives a root certificate during deployment and trusts both public and custom root CAs.

---

## API/SDK access patterns

### LSS configuration management

The `lssConfig` API manages LSS receiver configurations. For audit log streaming, the key field is `sourceLogType = "zpn_audit_log"`.

**API base path:** `/zpa/mgmtconfig/v2/admin/customers/{customerId}/lssConfig`

Source: `vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go`

#### Go SDK

Package: `github.com/zscaler/zscaler-sdk-go/v3/zscaler/zpa/services/lssconfigcontroller`

```go
// List all LSS configurations
configs, resp, err := lssconfigcontroller.GetAll(ctx, service)

// Get by ID
config, resp, err := lssconfigcontroller.Get(ctx, service, "lss-id-string")

// Get by name
config, resp, err := lssconfigcontroller.GetByName(ctx, service, "LSS Audit Logs")

// Create
lssResource := &lssconfigcontroller.LSSResource{
    LSSConfig: &lssconfigcontroller.LSSConfig{
        Name:          "LSS Audit Logs",
        Enabled:       true,
        LSSHost:       "splunk1.acme.com",
        LSSPort:       "5001",
        SourceLogType: "zpn_audit_log",
        Format:        "JSON",
        UseTLS:        true,
    },
    ConnectorGroups: []lssconfigcontroller.ConnectorGroups{
        {ID: "connector-group-id"},
    },
}
created, resp, err := lssconfigcontroller.Create(ctx, service, lssResource)

// Update
resp, err := lssconfigcontroller.Update(ctx, service, "lss-id", lssResource)

// Delete
resp, err := lssconfigcontroller.Delete(ctx, service, "lss-id")
```

#### Python SDK

Module: `zscaler.zpa.lss.LSSConfigControllerAPI` (accessed via `client.zpa.lss`)

The Python SDK maps the `audit_logs` key in `source_log_map` to `zpn_audit_log`:

```python
source_log_map = {
    "audit_logs": "zpn_audit_log",
    # ... other types
}
```

```python
# List LSS configurations
configs, response, error = client.zpa.lss.list_configs(search="Audit")

# JMESPath client-side filtering
# response supports resp.search(expression)
```

### `LSSResource` struct (Go)

Source: `vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | LSS configuration ID |
| `config` | LSSConfig | The LSS receiver configuration |
| `connectorGroups` | []ConnectorGroups | App Connector groups that forward logs |
| `policyRule` | PolicyRule | Optional LSS policy rule |
| `policyRuleResource` | PolicyRuleResource | Optional policy rule resource |

### `LSSConfig` struct fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Configuration ID |
| `name` | string | Configuration name |
| `description` | string | Optional description |
| `enabled` | bool | Active state |
| `filter` | []string | Log filter expressions |
| `format` | string | `JSON`, `CSV`, or `TSV` |
| `lssHost` | string | SIEM IP or FQDN |
| `lssPort` | string | SIEM TCP port |
| `sourceLogType` | string | Log type (e.g., `zpn_audit_log`) |
| `useTls` | bool | Enable TLS |
| `auditMessage` | string | Audit message attached to this config |
| `creationTime` | string | Read-only: creation timestamp |
| `modifiedBy` | string | Read-only: last modified by |
| `modifiedTime` | string | Read-only: last modified timestamp |
| `microtenantId` | string | Microtenant scoping |

### Pagination

LSS configuration listing uses the ZPA standard pagination engine: `common.GetAllPagesGeneric[LSSResource]`, which reads the `totalPages` envelope and fetches all pages automatically. No special pagination handling is needed in caller code.

---

## Streaming destinations

LSS audit logs are pushed over a **raw TCP connection** (optionally TLS-wrapped) from the App Connector to the configured SIEM or log receiver. Supported destinations are any system that can accept a TCP log stream, including:

- Splunk (HTTP Event Collector or raw TCP)
- Zscaler-documented third-party SIEM integrations (see Zscaler Private Access and Splunk Deployment Guide, referenced in help documentation)
- Any custom log receiver listening on a TCP port

Format is selectable: JSON, CSV, or TSV.

The log receiver must expose a port reachable from the App Connector's network. Mutual TLS requires the log receiver to present a certificate signed by a public root CA.

---

## ZPA admin roles and audit access

Per `vendor/zscaler-help/admin-rbac-captures.md`, ZPA has two predefined admin roles:

- **ZPA Administrator** — full read/write/delete access; can create custom admin roles.
- **ZPA Read Only Administrator** — view-only.

Custom roles can be configured with granular feature permissions. The **Log Streaming** feature permission controls access to the LSS configuration UI and API. Admins without Log Streaming permission cannot create or modify LSS receivers.

Role changes in ZPA take up to **2 minutes** to take effect.

---

## Open questions

1. **ZPA Admin Console audit log UI** — the ZPA portal's interactive audit log viewer (equivalent to ZIA's Audit Logs page) is referenced in help documentation but not visible in available sources. Whether ZPA has a portal UI for browsing audit logs directly (outside of LSS streaming) is not confirmed.

2. **Audit log field schema** — the specific fields present in a `zpn_audit_log` LSS stream entry (admin ID, action type, resource, before/after values, timestamp) are not captured in available sources. The LSS format document (`zpa_lss_config_log_type_formats` data source) would contain this but was not available.

3. **SIEM policy (`SIEM_POLICY`)** — the `data.zpa_policy_type.lss_siem_policy` data source appears in the Terraform example. The purpose of this policy type in relation to audit log streaming is not explained in available sources.

4. **Microtenant scoping** — `LSSConfig` has a `microtenantId` field. Whether audit logs from a microtenant are isolated to that microtenant's LSS configurations or visible to the parent is not confirmed.

5. **API-only audit log retrieval** — there is no ZPA equivalent of the ZIA `auditlogEntryReport` pull-based API. Whether audit logs can be retrieved as a point-in-time export (without configuring LSS) is not confirmed.

6. **Filter field** — `LSSConfig.filter` is a `[]string` but the valid filter expressions for the `zpn_audit_log` type are not documented in available sources.
