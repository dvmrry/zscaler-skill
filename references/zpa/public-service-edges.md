---
product: zpa
topic: "public-service-edges"
title: "ZPA Public Service Edges — Zscaler-managed default service edge (sourced from SDK / TF; help portal gap)"
content-type: reasoning
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_service_edge.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go"
author-status: draft
---

# ZPA Public Service Edges — Zscaler-managed default service edge

> **Source gap — help portal non-functional.** As of April 2026, the Zscaler help-portal page for ZPA Public Service Edges returns 404. This document is sourced entirely from the Python SDK (`service_edges.py`, `models/service_edges.py`) and the Terraform provider (`data_source_zpa_service_edge.go`, `resource_zpa_service_edge_group.go`), cross-referenced against `references/shared/cloud-architecture.md`. Treat all field-level detail as **confidence: medium**.

## What ZPA Public Service Edges are

A ZPA Public Service Edge (PSE) is the **Zscaler-operated, multi-tenant ZPA data-plane node** that brokers ZPA access sessions. When a ZCC client establishes a ZPA session, it connects to the nearest Public Service Edge, which then manages the M-Tunnel end-to-end to the App Connector behind the tenant's firewall. This is the default path for road-warrior ZPA traffic.

Public Service Edges are **entirely Zscaler-managed**. The operator does not deploy, configure, or update them. They are geo-distributed across Zscaler's PoPs and selected automatically based on the client's source IP / ZPA geo-routing logic. Operators observe them in logs and health views; they cannot alter their behavior.

**Do not confuse with:**

| Object | Product | Deployed by |
|---|---|---|
| ZPA Public Service Edge | ZPA | Zscaler — multi-tenant, read-only to operator |
| ZPA Private Service Edge | ZPA | Operator — single-tenant, full lifecycle control |
| ZIA Private Service Edge | ZIA | Operator — ZIA-specific, separate product entirely |

ZPA Private Service Edges (operator-deployed) are grouped and managed via `resource_zpa_service_edge_group`. There is no corresponding ZPA Private Service Edge reference doc under `references/zpa/` yet — track separately. For ZIA's PSE (a completely different concept on a different product), see [`../zia/private-service-edge.md`](../zia/private-service-edge.md).

## SDK and TF surface

The `/serviceEdge` API exposes individual Service Edge instances — these represent enrolled **Private** Service Edge nodes registered against an operator's tenant. The same `ServiceEdge` model and `/serviceEdge` endpoint are also how the platform surfaces Public Service Edge instance data when queried from a tenant context, though the operator will never enroll or configure them.

**Python SDK operations** (`service_edges.py`):

| Method | HTTP | Endpoint | Notes |
|---|---|---|---|
| `list_service_edges` | GET | `/zpa/mgmtconfig/v1/admin/customers/{id}/serviceEdge` | Paginated; `search`, `page`, `page_size`. |
| `get_service_edge` | GET | `.../serviceEdge/{serviceEdgeId}` | Returns single instance. |
| `update_service_edge` | PUT | `.../serviceEdge/{serviceEdgeId}` | Only `name`, `description`, `enabled` are meaningful for operator-managed edges. |
| `delete_service_edge` | DELETE | `.../serviceEdge/{serviceEdgeId}` | Deregisters a Private SE; not applicable to Public SEs. |
| `bulk_delete_service_edges` | POST | `.../serviceEdge/bulkDelete` | Batch deregister. |

**TF provider** (`data_source_zpa_service_edge.go`): exposes a **data source only** (`data.zpa_service_edge_controller`). No TF resource for creating or managing individual Service Edge instances. Membership in a Service Edge Group is managed via `resource_zpa_service_edge_group`, with a `service_edges` list field that is `Computed` and carries a deprecation warning: _"Service edge membership is managed externally."_

## Key fields on the ServiceEdge model

From `models/service_edges.py` and the TF data source schema:

| Python field | Wire key | Notes |
|---|---|---|
| `id` | `id` | Opaque ZPA object ID. |
| `name` | `name` | Display name. |
| `enabled` | `enabled` | Read-only for Public SEs; mutable on Private SEs. |
| `latitude` / `longitude` / `location` | — | Geo coordinates of the PoP or customer site. |
| `public_ip` / `private_ip` | `publicIp` / `privateIp` | Routable IPs of the SE node. |
| `control_channel_status` | `controlChannelStatus` | CA connectivity state. |
| `ctrl_broker_name` | `ctrlBrokerName` | The CA broker this SE is connected to. |
| `current_version` / `expected_version` | — | Software version state; upgrade-cadence fields. |
| `upgrade_status` / `upgrade_attempt` | — | Upgrade lifecycle state. |
| `last_broker_connect_time` | — | Timestamp of last CA channel establishment. |
| `service_edge_group_id` / `service_edge_group_name` | — | Which Service Edge Group this instance belongs to. |
| `provisioning_key_id` / `provisioning_key_name` | — | Private SE enrollment only; absent on Public SEs. |
| `sarge_version` | `sargeVersion` | Internal Zscaler component version string. |
| `zpn_sub_module_upgrade_list` | — | Per-module upgrade state. List of dicts. |

Fields related to provisioning keys (`provisioning_key_id`, `provisioning_key_name`, `enrollment_cert`) are only populated on **operator-enrolled Private Service Edges**. On Public Service Edges these will be absent or null.

## How Public Service Edges appear in operator workflows

**1. LSS access log records.** ZPA's Log Streaming Service emits per-session records that include the Service Edge that brokered the session. In LSS access-log records, the SE is the middle hop: `ZCC → Public Service Edge → App Connector → application`. The operator sees the SE identity in the log; they cannot influence which SE was selected. See [`./logs/access-log-schema.md`](./logs/access-log-schema.md).

**2. Geo-distribution and latency.** ZPA geo-routing selects the nearest Public Service Edge automatically. Operators have no direct control over this for Public SEs. Latency variation between sessions from different regions reflects which PoP the client was routed to.

**3. Health monitoring.** `control_channel_status` and broker connect/disconnect timestamps in the ServiceEdge object surface connectivity state. This is read-only. Health problems with Public SEs are Zscaler operational issues, not tenant configuration issues.

**4. Service Edge Groups (Private SE context).** For operators deploying Private Service Edges, `resource_zpa_service_edge_group` is the management surface — grouping, geo tagging (`latitude`, `longitude`, `country_code`), trusted-network binding, upgrade scheduling, and business-continuity mode (`exclusive_for_business_continuity`). This resource is the operator's lever; the individual SE instances inside it are enrolled by the Private SE appliance via provisioning key, not by Terraform directly.

## Cross-links

- Service Edge form factors (Public / Private / Virtual), CA model, M-Tunnel — [`../shared/cloud-architecture.md § Service Edges`](../shared/cloud-architecture.md)
- App Connector (the other endpoint of the M-Tunnel) — [`./app-connector.md`](./app-connector.md)
- Policy precedence and session gating — [`./policy-precedence.md`](./policy-precedence.md)
- LSS access log schema (where SE identity appears in logs) — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- ZIA Private Service Edge (different product, different concept — do not conflate) — [`../zia/private-service-edge.md`](../zia/private-service-edge.md)
- Trusted Networks — PSE Group ↔ Trusted Network binding — [`./trusted-networks.md`](./trusted-networks.md)
