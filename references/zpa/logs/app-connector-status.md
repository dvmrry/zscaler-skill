---
product: zpa
topic: "_data/logs/app-connector-status"
title: "ZPA LSS App Connector Status log — field reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-app-connector-status-log-fields"
author-status: draft
---

# ZPA LSS App Connector Status log — field reference

App Connector Status logs are emitted by LSS each time an App Connector changes its authentication state against a ZPA Service Edge — on connect, disconnect, or authentication failure. Unlike App Connector Metrics logs (which emit on a recurring ~5-minute interval regardless of state), Status logs are event-driven: one record per status change. Each record identifies the specific connector, the Service Edge it connected to, and carries a network health snapshot (CPU, memory, interface counters) captured at the moment of the event. The key differentiator from User Activity logs is perspective: Status logs describe the connector's control-plane session lifecycle, not individual user application connections.

## Example log record

```json
{
  "LogTimestamp": "Wed Oct  6 10:41:49 2021",
  "Customer": "Acme Corp",
  "SessionID": "9f510a6e-dca8-4fc5-8e67-af0df2688e49",
  "SessionType": "ZPN_ASSISTANT_BROKER_CONTROL",
  "SessionStatus": "ZPN_STATUS_AUTHENTICATED",
  "Version": "21.80.4",
  "Platform": "el7",
  "ZEN": "US-NY-3",
  "Connector": "USconnector-1633598427585",
  "ConnectorGroup": "US-East-Connectors",
  "PrivateIP": "10.10.1.50",
  "PublicIP": "198.51.100.10",
  "Latitude": "40.7128",
  "Longitude": "-74.0060",
  "CountryCode": "US",
  "TimestampAuthentication": "1633513309000000",
  "TimestampUnAuthentication": "0",
  "CPUUtilization": "3",
  "MemUtilization": "12",
  "ServiceCount": "67",
  "InterfaceDefRoute": "eth0",
  "DefRouteGW": "10.10.1.1",
  "PrimaryDNSResolver": "10.10.0.2",
  "HostStartTime": "1633510000",
  "ConnectorStartTime": "1633510500",
  "NumOfInterfaces": "2",
  "BytesRxInterface": "1048576",
  "PacketsRxInterface": "8192",
  "ErrorsRxInterface": "0",
  "DiscardsRxInterface": "0",
  "BytesTxInterface": "524288",
  "PacketsTxInterface": "4096",
  "ErrorsTxInterface": "0",
  "DiscardsTxInterface": "0",
  "TotalBytesRx": "1048576",
  "TotalBytesTx": "524288",
  "MicroTenantID": "145257480799129312"
}
```

## Field reference

| Field | Type | Description |
|---|---|---|
| `LogTimestamp` | string | Timestamp when the log was generated. Format specifiers: `s`, `j`, `J`. |
| `Customer` | string | The customer (tenant) name. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionID` | string | The TLS session ID for this control-plane session. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionType` | string | Type of session. Value is always `ZPN_ASSISTANT_BROKER_CONTROL`, denoting the App Connector → Public Service Edge control channel. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionStatus` | string | Status of the session. Enum: `ZPN_STATUS_AUTHENTICATED` (connector authenticated successfully), `ZPN_STATUS_AUTH_FAILED` (authentication failed), `ZPN_STATUS_DISCONNECTED` (connector disconnected from Service Edge). Format specifiers: `s`, `j`, `J`, `o`. |
| `Version` | string | App Connector software package version. Format specifiers: `s`, `j`, `J`, `o`. |
| `Platform` | string | Host OS platform (e.g., `el7`, `el8`, `ubuntu20`). Format specifiers: `s`, `j`, `J`, `o`. |
| `ZEN` | string | The Public Service Edge selected for this connection. Format specifiers: `s`, `j`, `J`, `o`. |
| `Connector` | string | The App Connector name. This is the join key with App Connector Metrics and User Activity logs. Format specifiers: `s`, `j`, `J`, `o`. |
| `ConnectorGroup` | string | The App Connector group name. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrivateIP` | string | The private IP address of the App Connector VM. Format specifiers: `s`, `j`, `J`, `o`. |
| `PublicIP` | string | The public (NAT) IP address of the App Connector. Format specifiers: `s`, `j`, `J`, `o`. |
| `Latitude` | float | Latitude coordinate of the App Connector's configured location. Format specifiers: `f`, `o`. |
| `Longitude` | float | Longitude coordinate of the App Connector's configured location. Format specifiers: `f`, `o`. |
| `CountryCode` | string | ISO country code for the App Connector location. Format specifiers: `s`, `j`, `J`, `o`. |
| `TimestampAuthentication` | string | Timestamp in microseconds when the connector authenticated. Zero when not yet authenticated. Format specifiers: `s`, `j`, `J`. |
| `TimestampUnAuthentication` | string | Timestamp in microseconds when the connector last deauthenticated. Zero if no deauthentication in this session. Format specifiers: `s`, `j`, `J`. |
| `CPUUtilization` | number | CPU utilization percentage at time of record. Format specifiers: `d`, `x`, `f`, `o`. |
| `MemUtilization` | number | Memory utilization percentage at time of record. Format specifiers: `d`, `x`, `f`, `o`. |
| `ServiceCount` | number | Number of domain/IP+port services being monitored by this connector. Format specifiers: `d`, `x`, `f`, `o`. |
| `InterfaceDefRoute` | string | Name of the network interface used for the default route. Format specifiers: `s`, `j`, `J`, `o`. |
| `DefRouteGW` | string | IP address of the default route gateway. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrimaryDNSResolver` | string | IP address of the connector's primary DNS resolver. Format specifiers: `s`, `j`, `J`, `o`. |
| `HostStartTime` | string | Unix timestamp (seconds) when the host VM was started. Format specifiers: `s`, `j`, `J`, `o`. |
| `ConnectorStartTime` | string | Unix timestamp (seconds) when the App Connector process was started. Format specifiers: `s`, `j`, `J`, `o`. |
| `NumOfInterfaces` | number | Number of network interfaces on the App Connector host. Format specifiers: `d`, `x`, `f`, `o`. |
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
| `MicroTenantID` | string | Microtenant ID of the App Connector. Format specifiers: `s`, `j`. |

## Splunk SPL patterns

### `connector-status-auth-failures`

**Purpose:** Find App Connectors with recent authentication failures — high-priority operational alert.

```spl
index=$INDEX_ZPA_STATUS SessionStatus=ZPN_STATUS_AUTH_FAILED earliest=-1h
| stats
    count as auth_failures
    values(ZEN) as zen_attempted
    values(Version) as versions
    by Connector ConnectorGroup
| sort -auth_failures
| rename auth_failures as "Auth Failures", zen_attempted as "ZEN Tried", versions as "Versions"
```

Persistent `ZPN_STATUS_AUTH_FAILED` without a follow-on `ZPN_STATUS_AUTHENTICATED` record within a few minutes indicates a connector with a certificate, enrollment, or network problem that requires hands-on investigation.

### `connector-reconnect-frequency`

**Purpose:** Track disconnect/reconnect cycles per connector — repeated cycling indicates network instability between the connector and the Service Edge.

```spl
index=$INDEX_ZPA_STATUS SessionStatus=ZPN_STATUS_DISCONNECTED earliest=-4h
| bin _time span=30m
| stats count as disconnects by _time Connector ZEN
| where disconnects > 2
| sort -disconnects
```

More than 2 disconnects from the same connector in a 30-minute window warrants investigation. Compare `ZEN` field across disconnect records — if the connector is bouncing between different Service Edges, this may indicate ZEN availability issues rather than connector problems.

## Cross-links

- ZPA App Connector Metrics log schema (per-connector resource telemetry; `Connector` join key) — [`./app-connector-metrics.md`](./app-connector-metrics.md)
- ZPA User Activity log schema (per-connection records; `Connector` join key) — [`./access-log-schema.md`](./access-log-schema.md)
- ZPA User Status log schema (user authentication and posture events) — [`./user-status-log-schema.md`](./user-status-log-schema.md)
- Private Service Edge Status log schema (analogous status events for PSE nodes) — [`./private-service-edge-status.md`](./private-service-edge-status.md)
