---
product: zpa
topic: "_data/logs/private-cloud-controller-status"
title: "ZPA LSS Private Cloud Controller Status log — field reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-private-cloud-controller-status-log-fields"
author-status: draft
---

# ZPA LSS Private Cloud Controller Status log — field reference

Private Cloud Controller (PCC) Status logs are emitted by LSS each time a Private Cloud Controller changes its authentication state against a ZPA Service Edge — on connect, disconnect, or authentication failure. The PCC is the control-plane component in ZPA Private Cloud deployments; its status logs are the PCC counterpart to App Connector Status logs. Each record captures the PCC's session state, software version, host platform, network configuration, and interface-level traffic counters at the moment of the event. The schema is structurally parallel to App Connector Status logs, with `PrivateCloudController` replacing `Connector` and `PrivateCloudControllerGroup` replacing `ConnectorGroup`. The session type value (`ZPN_TUNNEL_CONTROL`) also differs from the App Connector value (`ZPN_ASSISTANT_BROKER_CONTROL`).

## Example log record

```json
{
  "LogTimestamp": "Wed Oct  6 10:41:49 2021",
  "Customer": "Acme Corp",
  "SessionID": "7e3d9c1a-5b82-4f67-a391-bc4d8e0f2a15",
  "SessionType": "ZPN_TUNNEL_CONTROL",
  "SessionStatus": "ZPN_STATUS_AUTHENTICATED",
  "Version": "21.80.4",
  "PackageVersion": "21.80.4-1",
  "Platform": "el7",
  "ZEN": "US-NY-3",
  "PrivateCloudController": "pcc-us-east-1",
  "PrivateCloudControllerGroup": "US-East-PCCs",
  "PrivateIP": "10.50.1.10",
  "PublicIP": "198.51.100.50",
  "Latitude": "40.7128",
  "Longitude": "-74.0060",
  "CountryCode": "US",
  "TimestampAuthentication": "1633513309000000",
  "TimestampUnAuthentication": "0",
  "CPUUtilization": "8",
  "MemUtilization": "42",
  "InterfaceDefRoute": "eth0",
  "DefRouteGW": "10.50.1.1",
  "PrimaryDNSResolver": "10.50.0.2",
  "HostUpTime": "1633510000",
  "PrivateCloudControllerStartTime": "1633510500",
  "NumOfInterfaces": "2",
  "BytesRxInterface": "52428800",
  "PacketsRxInterface": "40960",
  "ErrorsRxInterface": "0",
  "DiscardsRxInterface": "0",
  "BytesTxInterface": "26214400",
  "PacketsTxInterface": "20480",
  "ErrorsTxInterface": "0",
  "DiscardsTxInterface": "0",
  "TotalBytesRx": "52428800",
  "TotalBytesTx": "26214400",
  "MicroTenantID": "145257480799129312"
}
```

## Field reference

| Field | Type | Description |
|---|---|---|
| `LogTimestamp` | string | Timestamp when the log was generated. Format specifiers: `s`, `j`, `J`. |
| `Customer` | string | The customer (tenant) name. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionID` | string | The TLS session ID for this control-plane session. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionType` | string | Type of session. Value is always `ZPN_TUNNEL_CONTROL`, denoting the PCC → Public Service Edge control channel. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionStatus` | string | Status of the session. Enum: `ZPN_STATUS_AUTHENTICATED` (PCC authenticated successfully), `ZPN_STATUS_AUTH_FAILED` (authentication failed), `ZPN_STATUS_DISCONNECTED` (PCC disconnected from Service Edge). Format specifiers: `s`, `j`, `J`, `o`. |
| `Version` | string | Private Cloud Controller software version. Format specifiers: `s`, `j`, `J`, `o`. |
| `PackageVersion` | string | Package version (may include build suffix). Format specifiers: `s`, `j`, `J`, `o`. |
| `Platform` | string | Host OS platform (e.g., `el7`, `el8`). Format specifiers: `s`, `j`, `J`, `o`. |
| `ZEN` | string | The Public Service Edge selected for this connection. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrivateCloudController` | string | The Private Cloud Controller name. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrivateCloudControllerGroup` | string | The Private Cloud Controller group name. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrivateIP` | string | Private IP address of the Private Cloud Controller. Format specifiers: `s`, `j`, `J`, `o`. |
| `PublicIP` | string | Public (NAT) IP address of the Private Cloud Controller. Format specifiers: `s`, `j`, `J`, `o`. |
| `Latitude` | float | Latitude coordinate of the PCC's configured location. Format specifiers: `f`, `o`. |
| `Longitude` | float | Longitude coordinate of the PCC's configured location. Format specifiers: `f`, `o`. |
| `CountryCode` | string | ISO country code for the PCC location. Format specifiers: `s`, `j`, `J`, `o`. |
| `TimestampAuthentication` | string | Timestamp (microseconds) when the PCC authenticated. Format specifiers: `s`, `j`, `J`. |
| `TimestampUnAuthentication` | string | Timestamp (microseconds) when the PCC last deauthenticated. Format specifiers: `s`, `j`, `J`. |
| `CPUUtilization` | number | CPU utilization percentage at time of record. Format specifiers: `d`, `x`, `f`, `o`. |
| `MemUtilization` | number | Memory utilization percentage at time of record. Format specifiers: `d`, `x`, `f`, `o`. |
| `InterfaceDefRoute` | string | Name of the network interface used for the default route. Format specifiers: `s`, `j`, `J`, `o`. |
| `DefRouteGW` | string | IP address of the default route gateway. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrimaryDNSResolver` | string | IP address of the PCC's primary DNS resolver. Format specifiers: `s`, `j`, `J`, `o`. |
| `HostUpTime` | string | Unix timestamp (seconds) when the host VM was started. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrivateCloudControllerStartTime` | string | Unix timestamp (seconds) when the PCC process was started. Format specifiers: `s`, `j`, `J`, `o`. |
| `NumOfInterfaces` | number | Number of network interfaces on the PCC host. Format specifiers: `d`, `x`, `f`, `o`. |
| `BytesRxInterface` | number | Bytes received on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `PacketsRxInterface` | number | Packets received on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `ErrorsRxInterface` | number | Receive errors on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `DiscardsRxInterface` | number | Receive discards on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `BytesTxInterface` | number | Bytes transmitted on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `PacketsTxInterface` | number | Packets transmitted on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `ErrorsTxInterface` | number | Transmit errors on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `DiscardsTxInterface` | number | Transmit discards on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalBytesRx` | number | Total bytes received across all interfaces. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalBytesTx` | number | Total bytes transmitted across all interfaces. Format specifiers: `d`, `x`, `f`, `o`. |
| `MicroTenantID` | string | Microtenant ID of the Private Cloud Controller. Format specifiers: `s`, `j`. |

## Splunk SPL patterns

### `pcc-auth-failures`

**Purpose:** Detect Private Cloud Controller authentication failures — a PCC that cannot authenticate to a Service Edge will interrupt ZPA Private Cloud operations.

```spl
index=$INDEX_ZPA_PCC_STATUS SessionStatus=ZPN_STATUS_AUTH_FAILED earliest=-1h
| stats
    count as failures
    values(ZEN) as zen_tried
    values(Version) as versions
    by PrivateCloudController PrivateCloudControllerGroup
| sort -failures
```

### `pcc-session-lifecycle`

**Purpose:** Reconstruct PCC session connect/disconnect history — useful for correlating ZPA Private Cloud outages with PCC state transitions.

```spl
index=$INDEX_ZPA_PCC_STATUS earliest=-24h
| eval event_type = case(
    SessionStatus="ZPN_STATUS_AUTHENTICATED", "CONNECT",
    SessionStatus="ZPN_STATUS_DISCONNECTED", "DISCONNECT",
    SessionStatus="ZPN_STATUS_AUTH_FAILED", "AUTH_FAIL",
    true(), SessionStatus
  )
| table LogTimestamp PrivateCloudController ZEN event_type Version
| sort LogTimestamp
```

## Cross-links

- ZPA Private Cloud Controller Metrics log schema (PCC resource telemetry) — [`./private-cloud-controller-metrics.md`](./private-cloud-controller-metrics.md)
- ZPA App Connector Status log schema (analogous status events for App Connectors) — [`./app-connector-status.md`](./app-connector-status.md)
- ZPA Private Service Edge Status log schema (analogous status for PSE nodes) — [`./private-service-edge-status.md`](./private-service-edge-status.md)
