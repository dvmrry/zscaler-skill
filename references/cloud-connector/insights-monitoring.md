---
product: cloud-connector
topic: cc-insights-monitoring
title: "Cloud Connector Insights & monitoring — health, traffic, operational metrics"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-about-insights.md"
  - "vendor/zscaler-help/cbc-accessing-cloud-branch-connector-monitoring.md"
  - "vendor/zscaler-help/cbc-analyzing-branch-connector-details.md"
  - "vendor/zscaler-help/cbc-analyzing-amazon-web-services-account-details.md"
  - "vendor/zscaler-help/cbc-about-cloud-connector-groups.md"
  - "vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md"
  - "vendor/zscaler-help/cbc-troubleshooting-cloud-connector-microsoft-azure.md"
  - "vendor/zscaler-help/cbc-troubleshooting-cloud-connector-amazon-web-services.md"
  - "vendor/zscaler-help/cbc-managing-cloud-branch-connector-upgrades.md"
  - "vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md"
  - "vendor/zscaler-help/cbc-understanding-zscaler-cloud-branch-connector-api.md"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/ecgroup/ecgroup.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/public_cloud_account/public_cloud_account.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go"
  - "vendor/terraform-provider-ztc/docs/data-sources/ztc_edge_connector_group.md"
author-status: draft
---

# Cloud Connector Insights & monitoring

How to observe the health, traffic, and operational state of deployed Cloud Connectors (CC) and Branch Connectors (BC). The product is known in the API and SDK as ZTW; the admin portal calls it Cloud & Branch Connector. This document uses ZTW/CBC interchangeably.

## 1. Overview

Cloud & Branch Connector exposes monitoring through two separate surface areas:

| Surface | What it covers |
|---|---|
| **Monitoring dashboard** (`Analytics & Monitoring > Cloud & Branch Connector Monitoring`) | Per-CC and per-BC operational status: health state, VM metadata, geolocation, auto-scaling flag, HA status. Inventory-level view across the fleet. |
| **Insights pages** (`Analytics & Monitoring > Insights`) | Transaction-level visibility: session logs, DNS query logs, tunnel statistics. Chart-driven, filterable, drillable. |

Retention, refresh rates, and whether data is available at the tenant level, per-group, or per-CC are only partially documented in captured sources (see section 8, Open Questions). What is confirmed: the Monitoring dashboard refreshes on demand (manual Refresh icon); Insights pages offer up to a 92-day custom window, with daily aggregation when multiple days are selected.

No dedicated CBC alerting surface (SNMP traps, email notifications, webhooks) was found in the captured CBC documentation. Alert delivery for Cloud Connector events appears to flow through Log & Control Forwarding (the CC-side operational message channel) rather than a pull-model alerting API. See section 6.

---

## 2. Dashboard surfaces

### 2.1 Cloud & Branch Connector Monitoring page

**Console path:** `Analytics & Monitoring > Cloud & Branch Connector Monitoring`

This is the fleet inventory view. It answers: "Which connectors are running, in what state, and where?"

#### Filtering

You can scope the table before querying. Filters differ by connector type:

**Cloud Connector filters:**

| Filter | Values |
|---|---|
| Cloud | AWS, Azure, GCP |
| Regions | Cloud-provider region |
| Account ID | AWS account ID / Azure subscription ID / GCP project name |
| Auto Scaling | True / False |
| VPC/VNet | VPC or VNet name |
| Sub-Network | Subnet name or CIDR |
| Host ID | Cloud Connector host identifier |
| Location | CBC location object |
| Status | Active, Inactive, or Disabled |

**Branch Connector filters:**

| Filter | Values |
|---|---|
| Location | Branch Connector location |
| Status | Active, Inactive, or Disabled |
| Branch Connector Location | Physical location of the Branch Connector |

#### Widgets

Three summary widgets appear above the table:

- **Total Entitled** — licensed connector capacity for the tenant.
- **Deployed Devices** — count of connectors that have registered and checked in.
- **Geoview** — world-map visualization of deployed connectors by physical location.

#### Monitoring table columns

| Column | Applies to | Notes |
|---|---|---|
| Name | Both | Display name of the CC or BC VM. |
| Type | Both | Cloud-provider type (AWS/Azure/GCP), hypervisor host, or hardware device. |
| Group | Both | The CC Group or BC Group the connector belongs to. |
| Location | Both | CBC location object associated with the group. |
| Account ID | CC only | AWS account ID, Azure subscription ID, or GCP project name. |
| Geo Location | Both | Physical location derived from deployment metadata. |
| Auto Scaling | CC only | True / False. Tracks whether ASG/VMSS/MIG autoscaling is enabled. |
| Status | Both | Active or Inactive. |
| HA Status | BC only | High availability status. Not shown for Cloud Connectors (CC HA is managed at the cloud-provider load-balancer layer, not reported per-VM). |
| VM Size | Both | Small or Medium. |

Clicking the **View** icon on any row opens the **Cloud Connector Details** or **Branch Connector Details** page.

### 2.2 Cloud Connector Details page

Accessible from the monitoring table via the View icon. Provides general, management, and traffic forwarding information for a single CC VM. The exact field set is not fully captured in available sources (see Open Questions), but the surface includes:

- General information: name, group, location, account/region, geo, status, VM size.
- Management information: management network (IP range, default gateway, DNS config), public NAT IP.
- Traffic forwarding state: active ZIA gateway, active ZPA broker, current build version, upgrade status.

### 2.3 Branch Connector Details page

Accessible from the monitoring table. Field layout varies by device type:

- **Gateway mode** — one-arm hardware deployment with separate WAN/LAN visibility.
- **Non-gateway mode** — hypervisor host or hardware device not in one-arm mode.

Captured fields include general info, management network, and forwarding state. Branch Connector also shows HA status (not available for Cloud Connector because CC HA runs at the load-balancer layer).

### 2.4 Insights pages

**Console path:** `Analytics & Monitoring > Insights`

Three Insights sub-pages, each with distinct data dimensions:

| Page | Path | Unit options |
|---|---|---|
| Session Insights | `Analytics > Session Insights` | Sessions, Bytes |
| DNS Insights | `Analytics > DNS Insights` | Transactions |
| Tunnel Insights | `Analytics > Tunnel Insights` | DPD Received, Received Bytes, Received Packets, Sent Bytes, Sent Packets |

#### Common Insights controls

- **Time range:** Predefined presets or Custom (end date up to 92 days after start date). Multi-day selections aggregate bytes/transactions per day.
- **Chart type:** Bar, trend, pie; users toggle between types. In trend and pie charts, only the top 5 items appear; the remainder is grouped as "Other."
- **Top-N selector:** For certain data types, choose top 5, 10, 25, 50, or 100 items.
- **Filters:** Multiple filters with multi-value selection support. Click **Apply Filters** to activate.
- **History bar:** Records up to 50 versions of the chart workflow during a session. Each filter change or chart-type change appends a version; clicking an older version restores it and discards all subsequent versions.
- **Drilldown:** Hover on a chart element and select **Click for more info** to view the raw Logs tab for that slice.
- **Logs tab:** Per-transaction log view filtered to the current chart selection.

#### Session Insights

Covers session-level transactions that Cloud Connector processes and forwards. Useful for understanding which workloads are generating traffic, which destinations they reach, and total bytes transferred.

Data dimensions available as filter criteria and chart breakdowns (partial list from captured sources; exhaustive enumeration is Tier B):

- Source (workload/location)
- Destination IP or FQDN
- Forwarding method (ZIA, ZPA, Direct, Drop)
- Session byte counts

#### DNS Insights

Covers DNS transactions traversing Cloud Connector. Unit is Transactions (query/response pairs). Useful for identifying DNS resolution patterns, volumes, and potential DNS policy triggers.

#### Tunnel Insights

Covers the ZIA and ZPA tunnel state from Cloud Connector to Zscaler service edges. Metrics:

| Metric | Description |
|---|---|
| DPD Received | Dead Peer Detection keepalive packets received from the ZIA/ZPA peer — proxy for tunnel liveness. |
| Received Bytes | Bytes received by CC from the ZIA/ZPA tunnel (inbound from Zscaler side). |
| Received Packets | Packet count companion to Received Bytes. |
| Sent Bytes | Bytes sent by CC to the ZIA/ZPA tunnel (workload traffic forwarded to Zscaler). |
| Sent Packets | Packet count companion to Sent Bytes. |

Tunnel Insights is the primary surface for validating that the CC-to-ZIA or CC-to-ZPA data path is carrying traffic. Zero Sent Bytes on an Active CC is the first indicator of a forwarding rule or gateway misconfiguration.

### 2.5 Cloud Connector Groups overview page

**Console path:** `Infrastructure > Connectors > Cloud > Management > Cloud Connector Groups`

This is the configuration management view rather than a monitoring view, but it surfaces operational state fields useful for monitoring:

| Field | Description |
|---|---|
| Operational Status | Active, Inactive, or Disabled per group. |
| Availability Zone | AZ where the group is deployed. |
| Upgrade Window | Scheduled upgrade day/time for the group. |

Groups can be filtered by Cloud (AWS/Azure/GCP), Group Type (Cloud Connector or Zero Trust Gateway), and Auto Scaling status. The group table is the fastest path to checking upgrade state across all groups.

---

## 3. Available metrics

### 3.1 Per-VM health metrics (Monitoring table / CC Details)

Available at the individual CC or BC VM level:

| Metric | Type | Source |
|---|---|---|
| Operational status | Enum: Active / Inactive / Disabled | Monitoring table + CC Details |
| VM Size | Enum: Small / Medium / Large | Monitoring table |
| Auto Scaling enabled | Boolean | Monitoring table (CC only) |
| HA Status | Enum: varies | Monitoring table (BC only) |
| ZIA Gateway | String (active gateway name) | CC Details page |
| ZPA Broker | String (active broker) | CC Details page |
| Build version | String (e.g. `24.x.x`) | CC Details / SDK `ecVMs[].buildVersion` |
| NAT IP | IPv4 string | CC Details / SDK `ecVMs[].natIp` |
| Last upgrade time | Unix timestamp | SDK `ecVMs[].lastUpgradeTime` |
| Upgrade status | Integer code | SDK `ecVMs[].upgradeStatus` |

The SDK `ECVMs` struct (from `zscaler/ztw/services/common/common.go`) surfaces the per-VM state fields programmatically — see section 5.

### 3.2 Cloud provider load-balancer health (external to ZTW)

Cloud Connector registers its health with the cloud-native load balancer by responding to HTTP health probes:

| Response | Meaning |
|---|---|
| `HTTP 200` on `?cchealth` path | CC is healthy; load balancer keeps it in rotation. |
| `HTTP 503` or no response | CC is unhealthy; load balancer removes it from rotation. |

Health probe intervals are set in deployment templates:

| Cloud provider | Default interval |
|---|---|
| Azure Load Balancer | 15 seconds |
| AWS Gateway Load Balancer (GWLB) | 30 seconds |

These probes are the authoritative health signal for traffic routing. The `Status: Active` field in the ZTW admin console reflects CC enrollment state, not load-balancer health — they can diverge during partial outages.

### 3.3 Tunnel-level metrics (Tunnel Insights)

Granularity: per-CC, per-session, or aggregated across the tenant depending on which filters are applied. Dimensions: time range (up to 92 days), direction (sent vs received), and tunnel peer (ZIA vs ZPA). Units: bytes or packets.

### 3.4 Session-level metrics (Session Insights)

Granularity: per-transaction. Filterable by source workload, destination, forwarding method, and time range.

### 3.5 DNS transaction metrics (DNS Insights)

Granularity: per-DNS-transaction. Unit is transactions (query/response count).

### 3.6 Workload discovery state (AWS Partner Integrations)

For AWS accounts using tag-based workload discovery, the `Analyzing Amazon Web Services Account Details` page surfaces per-region discovery service state:

| State field | Description |
|---|---|
| Discovery Service Status | Success / Disabled / Error / Starting Discovery |
| No of Private IP Addresses | Count of discovered workload IPs in the region |
| No of Duplicates IP | Count of duplicate IPs (flag for namespace issues) |
| Last Updates | Timestamp of last workload sync |

This is monitoring of the workload-discovery integration, not CC traffic — but it's operationally relevant because stale discovery data means tag-based policies are stale.

---

## 4. API/SDK access

No dedicated read-side "metrics" API was identified in the captured ZTW SDK surface. The ZTW API and SDK expose configuration and state objects rather than time-series metrics. The available programmatic reads for monitoring-adjacent data are:

### 4.1 Go SDK

**Package prefix:** `github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/services/`

**Edge Connector Group (fleet state):**

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/services/ecgroup"

// Retrieve all groups with per-VM state
groups, err := ecgroup.GetAll(ctx, service)

// Per group: groups[i].Status ([]string), groups[i].ECVMs contains:
//   ECVMs[j].OperationalStatus  string
//   ECVMs[j].ZiaGateway         string   — active ZIA gateway name
//   ECVMs[j].ZpaBroker          string   — active ZPA broker
//   ECVMs[j].BuildVersion       string
//   ECVMs[j].NatIP              string
//   ECVMs[j].LastUpgradeTime    int      — Unix timestamp
//   ECVMs[j].UpgradeStatus      int      — 0=current, non-zero=in-progress or failed
//   ECVMs[j].UpgradeStartTime   int
//   ECVMs[j].UpgradeEndTime     int
//   ECVMs[j].Status             []string — per-VM status flags
```

Endpoint: `GET /ztw/api/v1/ecgroup` (paginated, 1000 per page).

Lite variant (name + upgrade state only, lower payload): `GET /ztw/api/v1/ecgroup/lite`.

**Public cloud account status:**

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/services/provisioning/public_cloud_account"

status, err := public_cloud_account.GetAccountStatus(ctx, service)
// Returns: accountIdEnabled bool, subIdEnabled bool, projectIdEnabled bool
```

Endpoint: `GET /ztw/api/v1/publicCloudAccountIdStatus`.

**AWS workload discovery / region status:**

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/services/partner_integrations/public_cloud_info"

info, err := public_cloud_info.GetPublicCloudInfo(ctx, service, accountID)
// Returns: info.RegionStatus[]  — per-region discovery status (ID, Name, CloudType, Status bool)
// Returns: info.AccountDetails.TroubleShootingLogging bool
```

Endpoint: `GET /ztw/api/v1/publicCloudInfo/{id}`.

### 4.2 Terraform (read-side data sources)

The ZTC Terraform provider exposes `ztc_edge_connector_group` as a data source, which returns all per-VM state fields available in the SDK including `status`, `operational_status`, `zia_gateway`, `zpa_broker`, `build_version`, `last_upgrade_time`, `upgrade_status`, `nat_ip`, and the full management/service network configuration. Useful for GitOps health checks via `terraform plan` output.

```hcl
data "ztc_edge_connector_group" "prod" {
  name = "prod-aws-us-east-1"
}

output "connector_status" {
  value = data.ztc_edge_connector_group.prod.status
}
```

### 4.3 Insights data — no API path identified

The Session, DNS, and Tunnel Insights pages are UI-only in captured sources. No `/ztw/api/v1/insights/*` or equivalent endpoint was found in the Go SDK service list, Terraform provider, or help documentation. If programmatic access to Insights metrics is required, the current paths are:

1. **NSS for Firewall** (see section 6.2) — streams raw transaction logs to a SIEM where custom metrics can be derived.
2. **ZIA Admin Console** — CC traffic visible to ZIA (via ZIA forwarding method) appears in ZIA's own log and reporting surfaces (`Analytics > Web Insights`, ZIA API).

---

## 5. Alerting and integration

### 5.1 No native CC alert surface confirmed

No dedicated Cloud Connector alerting mechanism (email, SNMP trap, PagerDuty webhook) was found in the captured CBC documentation. This is a documented gap. The closest equivalents:

- **Cloud-provider native alerts** (AWS CloudWatch, Azure Monitor, GCP Cloud Monitoring): the cloud-native load balancer health probe results can trigger native alerts when CC health drops. This is the most reliable path for "CC went unhealthy" paging today.
- **Log & Control Forwarding** — CC sends operational events (enrollment, policy fetch, software update, session logs) upstream via this channel. Disruption to this channel is itself a health signal visible in the ZTW admin console if the CC goes Inactive.

### 5.2 NSS for Firewall — log streaming

Cloud & Branch Connector has NSS (Nanolog Streaming Service) support scoped to **NSS for Firewall** only. NSS for Web does not apply to CBC.

- Requires NSS for Firewall subscription.
- NSS virtual appliance can be deployed on Azure, AWS, or vSphere.
- Streams CC transaction logs to a Syslog receiver / SIEM.

This is the primary path for operators who need CC session logs in a SIEM for correlation, alerting, or retention beyond what the portal's Insights pages offer. Configure via the NSS deployment guide for your platform; ignore the NSS for Web sections.

### 5.3 ZIA-side visibility

CC traffic forwarded using the ZIA forwarding method is inspected by ZIA and appears in ZIA's own log surfaces (Web Insights, Firewall logs, ZIA API). Operators familiar with ZIA reporting can filter by CC location to see CC-originated traffic. This is not a ZTW-native metric path — it depends on traffic being ZIA-forwarded. Traffic sent Direct or ZPA does not appear in ZIA logs.

**Troubleshooting cross-reference (from Azure troubleshooting doc):**

> "Unable to monitor the traffic in the ZIA Admin Portal — verify that the Cloud Connector location created in the ZIA Admin Portal is registered and that tunnel logs show traffic to ZIA."

> "Unable to monitor the traffic in the ZPA Admin Portal — verify that Cloud Connector is registered in the ZPA Admin Portal and the forwarding filter is ZPA."

### 5.4 ZDX integration

ZDX (Zscaler Digital Experience) is cited in the product overview (Real-Time Visibility section mentions "Dashboards and Insights provide unparalleled visibility into your users and applications, and the health of your organization's applications and servers"), but no specific ZDX-to-CC metrics integration was found in captured CBC documentation. ZDX primarily targets endpoint experience from Zscaler Client Connector; its relevance to Cloud Connector (a server-side proxy) is Tier D — unconfirmed in captured sources.

---

## 6. Common gotchas

### 6.1 Status: Active ≠ load-balancer healthy

The ZTW admin console shows `Status: Active` when a CC is enrolled and checking in over its control channel. The cloud-provider load balancer health probe (`?cchealth`, 200/503) is a separate and orthogonal signal. A CC can be `Active` in the portal while simultaneously being marked unhealthy by the GWLB or Azure LB — if the CC's data-plane service interface is down but the management interface (which handles enrollment) is up. Always check the cloud-native load balancer health status when diagnosing traffic loss; do not rely on the portal Status column alone.

### 6.2 Tunnel Insights lag and aggregation

Multi-day Insights views aggregate bytes/transactions per day. Intraday spikes are not visible in multi-day trend views. For intraday granularity, use a single-day time range. The exact latency from transaction occurrence to Insights availability is not documented in captured sources (Tier D).

### 6.3 CC behind NAT — NAT IP vs private IP

CC VMs behind cloud-provider NAT (AWS NAT Gateway, Azure NAT Gateway, GCP Cloud NAT) will show their private service IP in the management console and their public NAT IP in ZIA tunnel logs. The two do not match. When cross-referencing ZIA tunnel logs (which show the NAT IP) against the ZTW monitoring table (which shows the private NAT IP from `natIp`), use the group and location as the correlation key — not the IP address.

### 6.4 Workload discovery staleness

AWS tag-based workload discovery syncs periodically (EventBridge-driven). If the discovery service status for a region is `Error` or `Starting Discovery`, tag-based policies targeting workloads in that region will use stale data or fail to match. The ZTW admin portal surfaces this on the AWS Account Details page (`Partner Integrations > AWS Accounts > [account name]`), but there is no push notification — operators must poll the page or check the API to catch stale states.

### 6.5 Duplicate IPs and namespace collisions

The AWS Account Details page surfaces a `No of Duplicates IP` counter per region. Non-zero values indicate multiple workloads sharing the same private IP across VPCs or accounts — typically an overlapping CIDR scenario in multi-account setups. Duplicate IPs cause undefined policy matching for tag-based rules. Resolve by configuring Namespaces (a VPC-endpoint scoping feature documented in `cbc-understanding-namespaces-amazon-web-services-and-microsoft-azure-accounts.md`).

### 6.6 Upgrade status visibility gap

CC groups upgrade automatically on a weekly schedule (Sunday midnight local time, by default, within a 2-hour window). Upgrades are staggered within a group to prevent service impact. The `upgradeStatus` field in the SDK `ECVMs` struct surfaces the current upgrade state as an integer code, but the mapping from code to human-readable state is not documented in captured sources (e.g., `0` = current; non-zero = in progress or failed — exact semantics unconfirmed, Tier D).

### 6.7 Missing Insights data for Direct-forwarded traffic

Traffic forwarded via the `Direct` method bypasses Zscaler entirely. Cloud Connector session logs for Direct-forwarded traffic are present in CC's own Log & Control Forwarding channel (forwarded upstream via NSS for Firewall) but do not appear in ZIA Web Insights or ZIA session logs. Operators accustomed to ZIA-based reporting will see gaps for Direct-forwarded workload traffic. Use CBC's Session Insights page or NSS-streamed logs to cover Direct-path traffic.

### 6.8 Log & Control Forwarding outage hides all metrics

If the Log & Control Forwarding gateway becomes unreachable, CC continues forwarding data-plane traffic but loses the ability to ship session logs and policy-sync events to Zscaler. From the cloud console, this looks like metric data stops accumulating while the CC remains `Active`. A CC with zero Insights data for an extended period despite Active status is the primary symptom. Verify the Log and Control Gateway's network path from CC independently of the data-plane path.

---

## 7. Cross-links

- Cloud Connector architecture and groups: [`./overview.md`](./overview.md)
- Traffic forwarding rules (what data CC moves): [`./forwarding.md`](./forwarding.md)
- DNS subsystem (DNS Insights context): [`./dns-subsystem.md`](./dns-subsystem.md)
- Log & Control Forwarding (the telemetry channel): [`./dns-subsystem.md § Log & Control Forwarding`](./dns-subsystem.md)
- API and SDK surface (ZTW CRUD endpoints): [`./api.md`](./api.md)
- Upgrade management: [`./upgrade-and-credential-rotation.md`](./upgrade-and-credential-rotation.md)
- AWS workload discovery: [`./aws-workload-discovery.md`](./aws-workload-discovery.md)

---

## 8. Open questions register

| # | Question | Impact |
|---|---|---|
| OQ-1 | **Insights data retention period** — is it 92 days (the maximum custom window) or shorter? Is there a retention policy separate from the UI time picker? | Affects SIEM strategy; if retention is short, NSS streaming is mandatory. |
| OQ-2 | **Insights API endpoints** — do any `/ztw/api/v1/insights/*` or similar endpoints exist for programmatic metric retrieval? Not found in SDK or help captures. | Affects automation/SIEM integration. |
| OQ-3 | **`upgradeStatus` integer codes** — what does each non-zero value mean (in-progress, failed, pending)? | Affects upgrade monitoring automation. |
| OQ-4 | **CC Details page — full field set** — the monitoring table View icon opens a details page; the full field inventory wasn't captured. Are there additional health sub-fields (CPU, memory, active session count) or is it limited to the fields visible in the monitoring table? | Affects depth of per-VM health visibility. |
| OQ-5 | **Alerting surface** — is there any CBC-native email or webhook alert for connector state changes (Active → Inactive)? The help doc structure implies no, but this warrants explicit confirmation. | Affects NOC/on-call tooling. |
| OQ-6 | **Insights metric latency** — how long after a session terminates does it appear in Session Insights? Minutes, hours? | Affects incident response workflows. |
| OQ-7 | **ZDX + Cloud Connector integration** — does ZDX surface any CC-specific health or performance metrics, or is ZDX scope limited to endpoint-side experience? | Affects monitoring toolchain decisions. |
| OQ-8 | **Tunnel Insights per-CC granularity** — can Tunnel Insights be filtered to a single CC VM, or is the minimum granularity a CC group? | Affects ability to isolate a single failing CC's tunnel stats. |
| OQ-9 | **SNMP** — is SNMP polling available for CC VMs (e.g., via the management interface)? Not found in captures. | Affects NMS integration for customers using SNMP-based monitoring. |
| OQ-10 | **DPD Received semantics** — does a drop in DPD Received on Tunnel Insights indicate the CC is not receiving tunnel keepalives (upstream fault) or the CC is down? Clarification needed for root-cause differentiation. | Affects alert triage runbooks. |
