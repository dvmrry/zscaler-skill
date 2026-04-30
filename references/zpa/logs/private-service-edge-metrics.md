---
product: zpa
topic: "_data/logs/private-service-edge-metrics"
title: "ZPA LSS Private Service Edge Metrics log — field reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-private-service-edge-metrics-log-fields"
author-status: draft
---

# ZPA LSS Private Service Edge Metrics log — field reference

Private Service Edge (PSE) Metrics logs are emitted by LSS on a regular cadence (approximately every 5 minutes) for each active Private Service Edge. A Private Service Edge is an on-premises ZPA data-plane component that enables App Connectors and ZCC clients to terminate ZPA tunnels locally without traversing the public ZPA cloud — reducing latency for users and connectors in the same data center or campus network. PSE Metrics logs capture resource utilization (CPU, memory), port pool consumption, file descriptor usage, and disk availability at the PSE level. The schema is nearly identical to App Connector Metrics and Private Cloud Controller Metrics, reflecting the shared infrastructure telemetry model. Unlike User Activity logs, PSE Metrics records carry no user identity — they are infrastructure telemetry for the PSE node.

Note: the timestamp field in this log type is named `LogTimeStamp` (capital S) rather than `LogTimestamp` — the casing difference is authoritative per the vendor documentation.

## Example log record

```json
{
  "LogTimeStamp": "Thu Oct  7 10:40:00 2021",
  "PrivateSE": "pse-us-east-datacenter-1",
  "CPUUtilization": "5",
  "SystemMemoryUtilization": "35",
  "ProcessMemoryUtilization": "12",
  "UsedTCPPortsIPv4": "182",
  "UsedUDPPortsIPv4": "14",
  "UsedTCPPortsIPv6": "2",
  "UsedUDPPortsIPv6": "0",
  "AvailablePorts": "28038",
  "SystemMaximumFileDescriptors": "960344",
  "SystemUsedFileDescriptors": "2480",
  "ProcessMaximumFileDescriptors": "512000",
  "ProcessUsedFileDescriptors": "620",
  "AvailableDiskBytes": "53687091200",
  "MicroTenantID": "145257480799129312"
}
```

## Field reference

| Field | Type | Description |
|---|---|---|
| `LogTimeStamp` | string | Timestamp when the log was generated. Note: capital S in `TimeStamp` — differs from other LSS log types that use `LogTimestamp`. Format specifiers: `s`, `j`, `J`. |
| `PrivateSE` | string | The name of the Private Service Edge. Format specifiers: `s`, `j`, `J`, `o`. |
| `CPUUtilization` | number | Maximum CPU usage in the past 5 minutes (percentage). Format specifiers: `s`, `j`, `J`, `d`. |
| `SystemMemoryUtilization` | number | Memory utilization of the entire VM (percentage). Format specifiers: `s`, `j`, `J`, `d`. |
| `ProcessMemoryUtilization` | number | Memory utilization of the Private Service Edge process (percentage). Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedTCPPortsIPv4` | number | Number of used TCP ports for IPv4 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedUDPPortsIPv4` | number | Number of used UDP ports for IPv4 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedTCPPortsIPv6` | number | Number of used TCP ports for IPv6 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `UsedUDPPortsIPv6` | number | Number of used UDP ports for IPv6 connections. Format specifiers: `s`, `j`, `J`, `d`. |
| `AvailablePorts` | number | Number of usable ports remaining. Format specifiers: `s`, `j`, `J`, `d`. |
| `SystemMaximumFileDescriptors` | number | Total Private Service Edge system file descriptor limit. Format specifiers: `s`, `j`, `J`, `d`. |
| `SystemUsedFileDescriptors` | number | Currently used system file descriptors. Format specifiers: `s`, `j`, `J`, `d`. |
| `ProcessMaximumFileDescriptors` | number | Total Private Service Edge process file descriptor limit. Format specifiers: `s`, `j`, `J`, `d`. |
| `ProcessUsedFileDescriptors` | number | Currently used process file descriptors. Format specifiers: `s`, `j`, `J`, `d`. |
| `AvailableDiskBytes` | number | Free bytes available on the Private Service Edge's disk. Format specifiers: `s`, `j`, `J`, `d`. |
| `MicroTenantID` | string | Microtenant ID of the Private Service Edge. Format specifiers: `s`, `j`. |

## Splunk SPL patterns

### `pse-resource-alert`

**Purpose:** Alert on Private Service Edges approaching resource exhaustion — port pool depletion, file descriptor pressure, or low disk.

```spl
index=$INDEX_ZPA_PSE_METRICS earliest=-15m
| eval fd_pct = round((ProcessUsedFileDescriptors / ProcessMaximumFileDescriptors) * 100, 1)
| eval port_used = UsedTCPPortsIPv4 + UsedUDPPortsIPv4 + UsedTCPPortsIPv6 + UsedUDPPortsIPv6
| eval port_pct = round((port_used / (port_used + AvailablePorts)) * 100, 1)
| eval disk_gb_free = round(AvailableDiskBytes / 1073741824, 2)
| where fd_pct > 75 OR port_pct > 70 OR disk_gb_free < 10
| table LogTimeStamp PrivateSE CPUUtilization SystemMemoryUtilization fd_pct port_pct disk_gb_free
| sort -fd_pct
```

### `pse-capacity-comparison`

**Purpose:** Compare resource utilization across all Private Service Edge nodes — identify imbalanced load or outlier nodes.

```spl
index=$INDEX_ZPA_PSE_METRICS earliest=-1h
| stats
    avg(CPUUtilization) as avg_cpu
    avg(SystemMemoryUtilization) as avg_mem
    avg(ProcessUsedFileDescriptors) as avg_fd
    avg(AvailablePorts) as avg_avail_ports
    by PrivateSE
| sort -avg_cpu
| table PrivateSE avg_cpu avg_mem avg_fd avg_avail_ports
```

## Cross-links

- ZPA Private Service Edge Status log schema (PSE session lifecycle events) — [`./private-service-edge-status.md`](./private-service-edge-status.md)
- ZPA App Connector Metrics log schema (analogous metrics for App Connectors) — [`./app-connector-metrics.md`](./app-connector-metrics.md)
- ZPA Private Cloud Controller Metrics log schema (analogous metrics for PCC nodes) — [`./private-cloud-controller-metrics.md`](./private-cloud-controller-metrics.md)

## Open questions

- Whether the `LogTimeStamp` field name (capital S) is intentional or a documentation typo — use this exact casing in log template configuration until confirmed otherwise.
