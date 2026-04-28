---
product: zpa
topic: "zpa-app-connector-metrics"
title: "ZPA App Connector Metrics log schema (LSS App Connector Metrics log fields)"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/about-app-connector-metrics-log-fields"
  - "vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.pdf"
  - "https://help.zscaler.com/zpa/understanding-log-stream-content-format"
  - "vendor/zscaler-help/Understanding_the_Log_Stream_Content_Format.pdf"
author-status: draft
---

# ZPA App Connector Metrics log schema (LSS App Connector Metrics log fields)

Authoritative field-level reference for ZPA App Connector Metrics logs — the LSS log type that records **per-connector resource utilization, connection counts, throughput, and file descriptor usage**. Derived directly from Zscaler's *Understanding App Connector Metrics Log Fields* article (vendored PDF).

## What App Connector Metrics logs capture

App Connector Metrics logs are emitted by LSS on a regular cadence (approximately every 5 minutes) for each active App Connector. They are infrastructure telemetry, not user-access records. Each record captures the connector's current operational state:

| Category | Fields |
|---|---|
| CPU and memory | `CPUUtilization`, `SystemMemoryUtilization`, `ProcessMemoryUtilization` |
| Application inventory | `AppCount`, `ServiceCount`, `TargetCount`, `AliveTargetCount` |
| M-Tunnel connections to Service Edges | `ActiveConnectionsToPublicSE`, `DisconnectedConnectionsToPublicSE`, `ActiveConnectionsToPrivateSE`, `DisconnectedConnectionsToPrivateSE` |
| Application-layer connections | `AppConnectionsCreated`, `AppConnectionsCleared`, `AppConnectionsActive` |
| Throughput | `TransmittedBytesToPublicSE`, `ReceivedBytesFromPublicSE`, `TransmittedBytesToPrivateSE`, `ReceivedBytesFromPrivateSE` |
| Port and file descriptor headroom | `UsedTCPPortsIPv4`, `UsedUDPPortsIPv4`, `UsedTCPPortsIPv6`, `UsedUDPPortsIPv6`, `AvailablePorts`, `SystemMaximumFileDescriptors`, `SystemUsedFileDescriptors`, `ProcessMaximumFileDescriptors`, `ProcessUsedFileDescriptors` |
| Disk | `AvailableDiskBytes` |

**App Connector Metrics vs User Activity**: metrics logs are connector-centric (one record per connector per interval, aggregated state). User Activity logs are connection-centric (one record per ZPA application connection, with `Connector` naming the connector that served it). The connector name is the join key between the two log types.

## Example log record

From *Understanding App Connector Metrics Log Fields*, p.1:

```json
{
  "LogTimestamp": "Thu Oct  7 10:40:00 2021",
  "Connector": "USconnector-1633598427585",
  "CPUUtilization": "1",
  "SystemMemoryUtilization": "9",
  "ProcessMemoryUtilization": "4",
  "AppCount": "129",
  "ServiceCount": "67",
  "TargetCount": "67",
  "AliveTargetCount": "62",
  "ActiveConnectionsToPublicSE": "1",
  "DisconnectedConnectionsToPublicSE": "0",
  "ActiveConnectionsToPrivateSE": "0",
  "DisconnectedConnectionsToPrivateSE": "0",
  "TransmittedBytesToPublicSE": "121350",
  "ReceivedBytesFromPublicSE": "27150",
  "TransmittedBytesToPrivateSE": "0",
  "ReceivedBytesFromPrivateSE": "0",
  "AppConnectionsCreated": "300",
  "AppConnectionsCleared": "300",
  "AppConnectionsActive": "0",
  "UsedTCPPortsIPv4": "11",
  "UsedUDPPortsIPv4": "4",
  "UsedTCPPortsIPv6": "1",
  "UsedUDPPortsIPv6": "5",
  "AvailablePorts": "28232",
  "SystemMaximumFileDescriptors": "960344",
  "SystemUsedFileDescriptors": "1280",
  "ProcessMaximumFileDescriptors": "512000",
  "ProcessUsedFileDescriptors": "152",
  "AvailableDiskBytes": "261886394368",
  "MicroTenantID": "145257480799129312"
}
```

## Field inventory

Per *Understanding App Connector Metrics Log Fields*, pp.1–6. All field names are **case-sensitive**.

### Identity and timestamp

| Field | Description | Format specifiers |
|---|---|---|
| `LogTimestamp` | Timestamp when the log was generated | `s`, `j`, `J` |
| `Connector` | The App Connector name | `s`, `j`, `J`, `o` |
| `MicroTenantID` | The Microtenant ID of the App Connector | `s`, `j` |

### CPU and memory utilization

| Field | Description | Format specifiers |
|---|---|---|
| `CPUUtilization` | Maximum CPU usage in the past 5 minutes (percentage) | `s`, `j`, `J`, `d` |
| `SystemMemoryUtilization` | Memory utilization of the entire VM (percentage) | `s`, `j`, `J`, `d` |
| `ProcessMemoryUtilization` | Memory utilization of the App Connector process (percentage) | `s`, `j`, `J`, `d` |

Note: `CPUUtilization` is the **maximum** over the past 5 minutes, not the average. A spike that resolves within the window still shows as the peak value.

### Application and target inventory

| Field | Description | Format specifiers |
|---|---|---|
| `AppCount` | Number of applications configured for access via this App Connector | `s`, `j`, `J`, `d` |
| `ServiceCount` | Number of services configured for access via this App Connector | `s`, `j`, `J`, `d` |
| `TargetCount` | Number of targets configured for access via this App Connector | `s`, `j`, `J`, `d` |
| `AliveTargetCount` | Number of targets currently alive/reachable via this App Connector | `s`, `j`, `J`, `d` |

`AliveTargetCount < TargetCount` is a health signal — some configured targets are unreachable from this connector's network position.

### M-Tunnel connections to Service Edges

| Field | Description | Format specifiers |
|---|---|---|
| `ActiveConnectionsToPublicSE` | Active Microtunnel (M-Tunnel) connections to the Public Service Edge | `s`, `j`, `J`, `d` |
| `DisconnectedConnectionsToPublicSE` | Disconnected M-Tunnel connections to the Public Service Edge | `s`, `j`, `J`, `d` |
| `ActiveConnectionsToPrivateSE` | Active M-Tunnel connections to the Private Service Edge | `s`, `j`, `J`, `d` |
| `DisconnectedConnectionsToPrivateSE` | Disconnected M-Tunnel connections to the Private Service Edge | `s`, `j`, `J`, `d` |

Non-zero `DisconnectedConnections*` values indicate M-Tunnel instability. When a connector loses all active PSE connections, users whose sessions were pinned to that connector will experience access disruptions.

### Application-layer connections

| Field | Description | Format specifiers |
|---|---|---|
| `AppConnectionsCreated` | Number of application M-Tunnel connections created (cumulative since last record) | `s`, `j`, `J`, `d` |
| `AppConnectionsCleared` | Number of application M-Tunnel connections cleared (cumulative since last record) | `s`, `j`, `J`, `d` |
| `AppConnectionsActive` | Number of active application M-Tunnel connections at time of record | `s`, `j`, `J`, `d` |

High `AppConnectionsActive` relative to peers indicates load concentration on a specific connector.

### Throughput

| Field | Description | Format specifiers |
|---|---|---|
| `TransmittedBytesToPublicSE` | Bytes transmitted by the App Connector to the Public Service Edge | `s`, `j`, `J`, `d` |
| `ReceivedBytesFromPublicSE` | Bytes received by the App Connector from the Public Service Edge | `s`, `j`, `J`, `d` |
| `TransmittedBytesToPrivateSE` | Bytes transmitted by the App Connector to the Private Service Edge | `s`, `j`, `J`, `d` |
| `ReceivedBytesFromPrivateSE` | Bytes received by the App Connector from the Private Service Edge | `s`, `j`, `J`, `d` |

These are per-interval delta values, not cumulative totals. To compute throughput rate, divide by the reporting interval.

### Port and file descriptor headroom

| Field | Description | Format specifiers |
|---|---|---|
| `UsedTCPPortsIPv4` | Used TCP ports for IPv4 connections | `s`, `j`, `J`, `d` |
| `UsedUDPPortsIPv4` | Used UDP ports for IPv4 connections | `s`, `j`, `J`, `d` |
| `UsedTCPPortsIPv6` | Used TCP ports for IPv6 connections | `s`, `j`, `J`, `d` |
| `UsedUDPPortsIPv6` | Used UDP ports for IPv6 connections | `s`, `j`, `J`, `d` |
| `AvailablePorts` | Number of usable ports remaining | `s`, `j`, `J`, `d` |
| `SystemMaximumFileDescriptors` | Total App Connector system file descriptor limit | `s`, `j`, `J`, `d` |
| `SystemUsedFileDescriptors` | Currently used system file descriptors | `s`, `j`, `J`, `d` |
| `ProcessMaximumFileDescriptors` | Total App Connector process file descriptor limit | `s`, `j`, `J`, `d` |
| `ProcessUsedFileDescriptors` | Currently used process file descriptors | `s`, `j`, `J`, `d` |

Port and file descriptor exhaustion are common failure modes on overloaded connectors. `AvailablePorts` approaching 0 or `ProcessUsedFileDescriptors` approaching `ProcessMaximumFileDescriptors` are operational emergency signals.

### Disk

| Field | Description | Format specifiers |
|---|---|---|
| `AvailableDiskBytes` | Free bytes available on the App Connector's disk | `s`, `j`, `J`, `d` |

## Relationship to User Activity logs

The `Connector` field in App Connector Metrics logs is the same value as the `Connector` field in User Activity logs — it is the connector's **display name** as configured in the ZPA admin portal.

This enables cross-log correlation:

- Use User Activity logs to see which connector served a specific user's application connections.
- Use App Connector Metrics logs to see that connector's resource state at the time of those connections.

Join pattern:

```spl
index=$INDEX_ZPA_METRICS Connector=$CONNECTOR_NAME earliest=-2h
| fields LogTimestamp Connector CPUUtilization SystemMemoryUtilization AppConnectionsActive AvailablePorts
| join type=left Connector
    [search index=$INDEX_ZPA earliest=-2h
     | stats count as connections values(Username) as users by Connector]
| table LogTimestamp Connector CPUUtilization SystemMemoryUtilization AppConnectionsActive connections AvailablePorts users
| sort LogTimestamp
```

Practical use: a user reporting intermittent ZPA access failures → look up their `Connector` in User Activity logs → look up that connector's `CPUUtilization` and `AppConnectionsActive` in Metrics logs for the same window → high CPU + connection count = overloaded connector.

## Splunk: identifying overloaded connectors

### `connector-cpu-high`

**Purpose:** Find connectors with sustained high CPU utilization over the last hour — leading indicator of connector overload before user complaints appear.

```spl
index=$INDEX_ZPA_METRICS earliest=-1h
| stats
    avg(CPUUtilization) as avg_cpu
    max(CPUUtilization) as peak_cpu
    avg(AppConnectionsActive) as avg_active_conns
    avg(SystemMemoryUtilization) as avg_mem
    by Connector
| where avg_cpu > 70 OR peak_cpu > 90
| sort -avg_cpu
| rename avg_cpu as "Avg CPU %", peak_cpu as "Peak CPU %", avg_active_conns as "Avg Active Conns"
```

Threshold guidance: `CPUUtilization > 80` sustained is a connector health concern. `> 90` peak warrants immediate investigation.

### `connector-top-by-connections`

**Purpose:** Rank connectors by active connection load — identifies load imbalance across a connector group.

```spl
index=$INDEX_ZPA_METRICS earliest=-30m
| stats
    avg(AppConnectionsActive) as avg_conns
    avg(CPUUtilization) as avg_cpu
    avg(SystemMemoryUtilization) as avg_mem
    avg(AvailablePorts) as avg_avail_ports
    by Connector
| sort -avg_conns
| table Connector avg_conns avg_cpu avg_mem avg_avail_ports
```

A healthy connector group shows roughly even `avg_conns` across members. High variance suggests sticky session behavior or asymmetric connector group membership on app segments.

### `connector-resource-alert`

**Purpose:** Alert on connectors approaching resource exhaustion — covers port exhaustion, file descriptor pressure, and low disk.

```spl
index=$INDEX_ZPA_METRICS earliest=-15m
| eval fd_utilization_pct = round((ProcessUsedFileDescriptors / ProcessMaximumFileDescriptors) * 100, 1)
| eval port_utilization_pct = round(((UsedTCPPortsIPv4 + UsedUDPPortsIPv4) / (UsedTCPPortsIPv4 + UsedUDPPortsIPv4 + AvailablePorts)) * 100, 1)
| eval disk_gb_free = round(AvailableDiskBytes / 1073741824, 2)
| where fd_utilization_pct > 80 OR port_utilization_pct > 70 OR disk_gb_free < 5
| table LogTimestamp Connector CPUUtilization fd_utilization_pct port_utilization_pct disk_gb_free
| sort -fd_utilization_pct
```

Interpretation:
- `fd_utilization_pct > 80` — process file descriptor pressure; connector approaching limits that would cause connection refusals.
- `port_utilization_pct > 70` — TCP/UDP port pool pressure; new outbound connections will fail when fully exhausted.
- `disk_gb_free < 5` — low disk on the connector VM; may affect log writing and process stability.

### `connector-target-health`

**Purpose:** Identify connectors where configured targets are partially unreachable — indicates network connectivity issues between the connector and backend servers.

```spl
index=$INDEX_ZPA_METRICS TargetCount>0 earliest=-1h
| eval dead_targets = TargetCount - AliveTargetCount
| eval target_availability_pct = round((AliveTargetCount / TargetCount) * 100, 1)
| where target_availability_pct < 100
| stats
    avg(target_availability_pct) as avg_availability
    avg(dead_targets) as avg_dead_targets
    values(AppCount) as apps_affected
    by Connector
| sort avg_availability
```

## Cross-links

- ZPA User Activity log schema (connection-level records; the `Connector` join key) — [`./access-log-schema.md`](./access-log-schema.md)
- ZPA User Status log schema (authentication and posture state) — [`./user-status-log-schema.md`](./user-status-log-schema.md)
- SPL patterns including app-connector-metrics sections — [`../../shared/splunk-queries.md`](../../shared/splunk-queries.md)

## Open questions

- Whether the metrics log interval is a fixed 5 minutes or configurable per LSS receiver — the PDF does not specify. Field cadence is consistent with a 5-minute polling model inferred from the ZDX metric interval.
- Whether `AppConnectionsCreated` and `AppConnectionsCleared` are delta (since last record) or cumulative since connector start — the example record shows `300` / `300` with `AppConnectionsActive` = `0`, consistent with delta behavior.
