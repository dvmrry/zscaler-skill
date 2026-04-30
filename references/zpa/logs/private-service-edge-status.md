---
product: zpa
topic: "_data/logs/private-service-edge-status"
title: "ZPA LSS Private Service Edge Status log — field reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-private-service-edge-status-log-fields"
author-status: draft
---

# ZPA LSS Private Service Edge Status log — field reference

Private Service Edge (PSE) Status logs are emitted by LSS each time a Private Service Edge changes its authentication state against a Public Service Edge — on connect, disconnect, or authentication failure. A Private Service Edge is an on-premises ZPA data-plane node; PSE Status logs are its control-plane session lifecycle record, exactly as App Connector Status logs are for connectors. Each record captures the PSE's session state, package version, host platform, network topology, and interface counters at the moment of the event. Key schema differences from App Connector Status: the entity fields are `ServiceEdge` and `ServiceEdgeGroup` (not `Connector` and `ConnectorGroup`); there is no separate `Version` field (only `PackageVersion`); the unauthentication timestamp field name contains a typo in the vendor source (`TimestampUnAuthnetication` — note "Authnetication"). The session type value `ZPN_TUNNEL_CONTROL` is shared with Private Cloud Controller Status.

## Example log record

```json
{
  "LogTimestamp": "Wed Oct  6 10:41:49 2021",
  "Customer": "Acme Corp",
  "SessionID": "3f71d8c9-4a52-4b8e-9c1d-6e7f8a9b0c2d",
  "SessionType": "ZPN_TUNNEL_CONTROL",
  "SessionStatus": "ZPN_STATUS_AUTHENTICATED",
  "PackageVersion": "21.80.4-1",
  "Platform": "el7",
  "ZEN": "US-NY-3",
  "ServiceEdge": "pse-us-east-datacenter-1",
  "ServiceEdgeGroup": "US-East-PSE-Group",
  "PrivateIP": "10.30.1.20",
  "Latitude": "40.7128",
  "Longitude": "-74.0060",
  "CountryCode": "US",
  "TimestampAuthentication": "1633513309000000",
  "TimestampUnAuthnetication": "0",
  "CPUUtilization": "5",
  "MemUtilization": "35",
  "InterfaceDefRoute": "eth0",
  "DefRouteGW": "10.30.1.1",
  "PrimaryDNSResolver": "10.30.0.2",
  "HostStartTime": "1633510000",
  "ServiceEdgeStartTime": "1633510500",
  "NumOfInterfaces": "2",
  "BytesRxInterface": "104857600",
  "PacketsRxInterface": "81920",
  "ErrorsRxInterface": "0",
  "DiscardsRxInterface": "0",
  "BytesTxInterface": "52428800",
  "PacketsTxInterface": "40960",
  "DiscardsTxInterface": "0",
  "ErrorsTxInterface": "0",
  "TotalBytesRx": "104857600",
  "TotalBytesTx": "52428800",
  "MicroTenantID": "145257480799129312"
}
```

## Field reference

| Field | Type | Description |
|---|---|---|
| `LogTimestamp` | string | Timestamp when the log was generated. Format specifiers: `s`, `j`, `J`. |
| `Customer` | string | The customer (tenant) name. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionID` | string | The TLS session ID for this control-plane session. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionType` | string | Type of session. Value is always `ZPN_TUNNEL_CONTROL`, denoting the PSE → Public Service Edge control channel. Format specifiers: `s`, `j`, `J`, `o`. |
| `SessionStatus` | string | Status of the session. Enum: `ZPN_STATUS_AUTHENTICATED` (PSE authenticated successfully), `ZPN_STATUS_AUTH_FAILED` (authentication failed), `ZPN_STATUS_DISCONNECTED` (PSE disconnected from Service Edge). Format specifiers: `s`, `j`, `J`, `o`. |
| `PackageVersion` | string | Private Service Edge software package version. Format specifiers: `s`, `j`, `J`, `o`. |
| `Platform` | string | Host OS platform (e.g., `el7`, `el8`). Format specifiers: `s`, `j`, `J`, `o`. |
| `ZEN` | string | The Public Service Edge selected for this connection. Format specifiers: `s`, `j`, `J`, `o`. |
| `ServiceEdge` | string | The Private Service Edge name. Format specifiers: `s`, `j`, `J`, `o`. |
| `ServiceEdgeGroup` | string | The Service Edge group name. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrivateIP` | string | Private IP address of the Private Service Edge. (Note: no `PublicIP` field for PSE, unlike App Connector Status.) Format specifiers: `s`, `j`, `J`, `o`. |
| `Latitude` | float | Latitude coordinate of the PSE's configured location. Format specifiers: `f`, `o`. |
| `Longitude` | float | Longitude coordinate of the PSE's configured location. Format specifiers: `f`, `o`. |
| `CountryCode` | string | ISO country code for the PSE location. Format specifiers: `s`, `j`, `J`, `o`. |
| `TimestampAuthentication` | string | Timestamp (microseconds) when the PSE authenticated. Format specifiers: `s`, `j`, `J`. |
| `TimestampUnAuthnetication` | string | Timestamp (microseconds) when the PSE last deauthenticated. **Note: field name contains a typo ("Authnetication") — use this exact spelling in log templates and queries.** Format specifiers: `s`, `j`, `J`. |
| `CPUUtilization` | number | CPU utilization percentage at time of record. Format specifiers: `d`, `x`, `f`, `o`. |
| `MemUtilization` | number | Memory utilization percentage at time of record. Format specifiers: `d`, `x`, `f`, `o`. |
| `InterfaceDefRoute` | string | Name of the network interface used for the default route. Format specifiers: `s`, `j`, `J`, `o`. |
| `DefRouteGW` | string | IP address of the default route gateway. Format specifiers: `s`, `j`, `J`, `o`. |
| `PrimaryDNSResolver` | string | IP address of the PSE's primary DNS resolver. Format specifiers: `s`, `j`, `J`, `o`. |
| `HostStartTime` | string | Unix timestamp (seconds) when the host VM was started. Format specifiers: `s`, `j`, `J`, `o`. |
| `ServiceEdgeStartTime` | string | Unix timestamp (seconds) when the Private Service Edge process was started. Format specifiers: `s`, `j`, `J`, `o`. |
| `NumOfInterfaces` | number | Number of network interfaces on the PSE host. Format specifiers: `d`, `x`, `f`, `o`. |
| `BytesRxInterface` | number | Bytes received on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `PacketsRxInterface` | number | Packets received on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `ErrorsRxInterface` | number | Receive errors on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `DiscardsRxInterface` | number | Receive discards on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `BytesTxInterface` | number | Bytes transmitted on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `PacketsTxInterface` | number | Packets transmitted on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `DiscardsTxInterface` | number | Transmit discards on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `ErrorsTxInterface` | number | Transmit errors on the primary network interface. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalBytesRx` | number | Total bytes received across all interfaces. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalBytesTx` | number | Total bytes transmitted across all interfaces. Format specifiers: `d`, `x`, `f`, `o`. |
| `MicroTenantID` | string | Microtenant ID of the Private Service Edge. Format specifiers: `s`, `j`. |

## Splunk SPL patterns

### `pse-auth-failures`

**Purpose:** Detect Private Service Edge authentication failures — a PSE that cannot authenticate to a Public Service Edge will prevent on-premises users from establishing ZPA tunnels through that PSE.

```spl
index=$INDEX_ZPA_PSE_STATUS SessionStatus=ZPN_STATUS_AUTH_FAILED earliest=-1h
| stats
    count as failures
    values(ZEN) as zen_tried
    values(PackageVersion) as versions
    by ServiceEdge ServiceEdgeGroup
| sort -failures
```

### `pse-reconnect-instability`

**Purpose:** Identify PSE nodes with frequent disconnect/reconnect cycles.

```spl
index=$INDEX_ZPA_PSE_STATUS SessionStatus=ZPN_STATUS_DISCONNECTED earliest=-6h
| bin _time span=1h
| stats count as disconnects by _time ServiceEdge ServiceEdgeGroup ZEN
| where disconnects > 3
| sort -disconnects
| rename disconnects as "Disconnects per Hour"
```

## Cross-links

- ZPA Private Service Edge Metrics log schema (PSE resource telemetry) — [`./private-service-edge-metrics.md`](./private-service-edge-metrics.md)
- ZPA App Connector Status log schema (analogous events for App Connectors) — [`./app-connector-status.md`](./app-connector-status.md)
- ZPA Private Cloud Controller Status log schema (analogous events for PCC nodes) — [`./private-cloud-controller-status.md`](./private-cloud-controller-status.md)

## Known issues

- `TimestampUnAuthnetication` — field name has a typo in the vendor source ("Authnetication" instead of "Unauthentication"). Use the typo'd spelling verbatim in log template configuration and SPL field references.
