---
product: zpa
topic: "logs/private-cloud-controller-metrics"
title: "ZPA LSS Private Cloud Controller Metrics log — field reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-private-cloud-controller-metrics-log-fields"
author-status: draft
---

# ZPA LSS Private Cloud Controller Metrics log — field reference

Private Cloud Controller (PCC) Metrics logs are emitted by LSS on a regular cadence (approximately every 5 minutes) for each active Private Cloud Controller. The PCC is a ZPA infrastructure component used in ZPA Private Cloud deployments — it provides the control-plane functions of the ZPA cloud for customers operating a fully on-premises or sovereign ZPA deployment. Metrics logs capture per-PCC resource utilization (CPU, memory), port pool consumption, file descriptor usage, and disk availability. The schema is closely analogous to App Connector Metrics logs, reflecting the shared infrastructure monitoring model. Unlike User Activity logs, PCC Metrics records carry no user identity — they are infrastructure telemetry for the PCC node itself.

## Example log record

```json
{
  "LogTimestamp": "Thu Oct  7 10:40:00 2021",
  "PrivateCloudController": "pcc-us-east-1",
  "CPUUtilization": "8",
  "SystemMemoryUtilization": "42",
  "ProcessMemoryUtilization": "18",
  "UsedTCPPortsIPv4": "312",
  "UsedUDPPortsIPv4": "28",
  "UsedTCPPortsIPv6": "4",
  "UsedUDPPortsIPv6": "0",
  "AvailablePorts": "27892",
  "SystemMaximumFileDescriptors": "960344",
  "SystemUsedFileDescriptors": "4120",
  "ProcessMaximumFileDescriptors": "512000",
  "ProcessUsedFileDescriptors": "890",
  "AvailableDiskBytes": "107374182400"
}
```

## Field reference

| Field | Type | Description |
|---|---|---|
| `LogTimestamp` | string | Timestamp when the log was generated. Format specifiers: `s`, `j`, `J`. |
| `PrivateCloudController` | string | The Private Cloud Controller name. Format specifiers: `s`, `j`, `J`, `o`. |
| `CPUUtilization` | number | Maximum CPU usage in the past 5 minutes (percentage). Format specifiers: `s`, `j`, `J`, `d`. |
| `SystemMemoryUtilization` | number | Memory utilization of the entire VM (percentage). Format specifiers: `s`, `j`, `J`, `d`. |
| `ProcessMemoryUtilization` | number | Memory utilization of the Private Cloud Controller process (percentage). Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedTCPPortsIPv4` | number | Number of used TCP ports for IPv4 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedUDPPortsIPv4` | number | Number of used UDP ports for IPv4 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedTCPPortsIPv6` | number | Number of used TCP ports for IPv6 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedUDPPortsIPv6` | number | Number of used UDP ports for IPv6 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `AvailablePorts` | number | Number of usable ports remaining. Format specifiers: `s`, `j`, `J`, `d`. |
| `SystemMaximumFileDescriptors` | number | Total Private Cloud Controller system file descriptor limit. Format specifiers: `s`, `j`, `J`, `d`. |
| `SystemUsedFileDescriptors` | number | Currently used system file descriptors. Format specifiers: `s`, `j`, `J`, `d`. |
| `ProcessMaximumFileDescriptors` | number | Total Private Cloud Controller process file descriptor limit. Format specifiers: `s`, `j`, `J`, `d`. |
| `ProcessUsedFileDescriptors` | number | Currently used process file descriptors. Format specifiers: `s`, `j`, `J`, `d`. |
| `AvailableDiskBytes` | number | Free bytes available on the Private Cloud Controller's disk. Format specifiers: `s`, `j`, `J`, `d`. |

## Splunk SPL patterns

### `pcc-resource-pressure`

**Purpose:** Identify Private Cloud Controllers approaching resource limits — port exhaustion, file descriptor pressure, or low disk.

```spl
index=$INDEX_ZPA_PCC_METRICS earliest=-15m
| eval fd_pct = round((ProcessUsedFileDescriptors / ProcessMaximumFileDescriptors) * 100, 1)
| eval port_used = UsedTCPPortsIPv4 + UsedUDPPortsIPv4 + UsedTCPPortsIPv6 + UsedUDPPortsIPv6
| eval port_pct = round((port_used / (port_used + AvailablePorts)) * 100, 1)
| eval disk_gb_free = round(AvailableDiskBytes / 1073741824, 2)
| where fd_pct > 75 OR port_pct > 70 OR disk_gb_free < 10
| table LogTimestamp PrivateCloudController CPUUtilization SystemMemoryUtilization fd_pct port_pct disk_gb_free
| sort -fd_pct
```

### `pcc-cpu-trend`

**Purpose:** Track CPU and memory trend for each Private Cloud Controller over time — useful for capacity planning and identifying gradual resource growth.

```spl
index=$INDEX_ZPA_PCC_METRICS earliest=-24h
| bin _time span=15m
| stats
    avg(CPUUtilization) as avg_cpu
    avg(SystemMemoryUtilization) as avg_mem
    avg(ProcessMemoryUtilization) as avg_proc_mem
    by _time PrivateCloudController
| sort _time
```

## Cross-links

- ZPA Private Cloud Controller Status log schema (PCC session lifecycle events) — [`./private-cloud-controller-status.md`](./private-cloud-controller-status.md)
- ZPA App Connector Metrics log schema (analogous metrics for App Connectors) — [`./app-connector-metrics.md`](./app-connector-metrics.md)
- ZPA Private Service Edge Metrics log schema (analogous metrics for Private Service Edges) — [`./private-service-edge-metrics.md`](./private-service-edge-metrics.md)
