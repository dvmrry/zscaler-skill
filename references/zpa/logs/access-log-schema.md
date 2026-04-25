---
product: zpa
topic: "zpa-access-log-schema"
title: "ZPA access log schema (LSS User Activity log fields)"
content-type: reference
last-verified: "2026-04-23"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-user-activity-log-fields"
  - "vendor/zscaler-help/Understanding_User_Activity_Log_Fields.pdf"
  - "https://help.zscaler.com/zpa/understanding-log-stream-content-format"
  - "vendor/zscaler-help/Understanding_the_Log_Stream_Content_Format.pdf"
  - "https://help.zscaler.com/zpa/about-user-status-log-fields"
  - "vendor/zscaler-help/Understanding_User_Status_Log_Fields.pdf"
  - "https://help.zscaler.com/zpa/about-app-connector-metrics-log-fields"
  - "vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.pdf"
author-status: draft
---

# ZPA access log schema (LSS User Activity log fields)

Authoritative field-level reference for ZPA User Activity logs — the primary "access log" stream produced by the Log Streaming Service (LSS). Derived directly from Zscaler's *Understanding User Activity Log Fields* article (vendored PDF).

## LSS in context

From *Understanding the Log Stream Content Format*, p.1, LSS emits twelve log types:

> Audit Logs, App Connector Metrics, App Connector Status, Browser Access, Microsegmentation Flow, Private Cloud Controller Metrics, Private Cloud Controller Status, Private Service Edge Metrics, Private Service Edge Status, User Activity, User Status, Web Inspection.

This doc documents the **User Activity** log type — per-connection records that carry the application segment, access policy, and App Connector outcome. Other types are referenced at the bottom.

## Log Stream Content Format specifications

Per *Understanding the Log Stream Content Format*, pp.1–3, each field in an LSS template is referenced with a format specifier:

| Specifier | Behavior |
|---|---|
| `%[OPT]s{<field>}` | String |
| `%[OPT]s{LogTimestamp:<subfield>}` | LogTimestamp formatted by the named subfield (`us`, `ms`, `ss`, `mm`, `hh`, `dd`, `mth`, `mon`, `yyy`, `day`, `time`, `iso8601`, `epoch`, `epoch_ms`, `epoch_us`) |
| `%[OPT]j{<field>}` | JSON string with quotation marks |
| `%[OPT]J{<field>}` | JSON string without quotation marks |
| `%[OPT]d{<field>}` | Decimal integer |
| `%[OPT]x{<field>}` | Hexadecimal (base-16) |
| `%[OPT]f{<field>}` | Float |
| `%[OPT]o{<field>}` | 256-bit one-way hashed (obfuscated) — precision-limitable for shorter output |

`[OPT]` is an optional printf-style width/precision specifier. Field names are **case sensitive** per p.3. Default Log Stream Content auto-appends `\n` after the last field; custom templates must include at least one.

## User Activity field inventory

Per *Understanding User Activity Log Fields*, pp.2–14. The rightmost column lists supported format specifiers per the CSV; `o` indicates the field supports obfuscation.

### Session identity

| Field | Description | Supported format specifiers |
|---|---|---|
| `LogTimestamp` | Timestamp when the log was generated | `s`, `j`, `J` |
| `SessionID` | The TLS session ID | `s`, `j`, `J`, `o` |
| `ConnectionID` | The application connection ID | `s`, `j`, `J`, `o` |
| `ConnectionStatus` | Status of the connection: `Open`, `Close`, `Active` | `s`, `j`, `J`, `o` |
| `InternalReason` | Internal reason for the status of the transaction | `s`, `j`, `J`, `o` |
| `Customer` | Customer name | `s`, `j`, `J`, `o` |
| `MicroTenantID` | Microtenant ID of the user accessing the application | `s`, `j` |
| `AppMicroTenantID` | Microtenant ID of the application | `s`, `j` |

### User and client

| Field | Description | Supported format specifiers |
|---|---|---|
| `Username` | Username as entered into Zscaler Client Connector | `s`, `j`, `J`, `o` |
| `Idp` | Identity provider name as configured in the Zscaler Admin Console | `s`, `j`, `J`, `o` |
| `Hostname` | Device name as reported by Zscaler Client Connector. **Only provides valid values for Zscaler Client Connector and machine tunnel client types.** | `s`, `j`, `J`, `o` |
| `Platform` | Platform on the device (e.g., Windows) | `s`, `j`, `J`, `o` |
| `ClientPublicIP` | Public IP address of Zscaler Client Connector | `s`, `j`, `J`, `o` |
| `ClientPrivateIP` | Private IP address of Zscaler Client Connector | `s`, `j`, `J`, `o` |
| `ClientCity` | City of the client | `s`, `j` |
| `ClientCountryCode` | Country code of the Zscaler Client Connector location | `s`, `j`, `J`, `o` |
| `ClientLatitude` | Latitude coordinate | `f`, `o` |
| `ClientLongitude` | Longitude coordinate | `f`, `o` |
| `ClientToClient` | Status of the client-to-client connection | `s` |
| `ClientZEN` | The Public Service Edge that received the request from Zscaler Client Connector | `s`, `j`, `J`, `o` |

### Application and segment

| Field | Description | Supported format specifiers |
|---|---|---|
| `Application` | The application name | `s`, `j`, `J`, `o` |
| `AppGroup` | The application group name | `s`, `j`, `J`, `o` |
| `Host` | The destination host domain or IP address | `s`, `j`, `J`, `o` |
| `Server` | Server ID name. **Server ID is `0` if Dynamic Server Discovery is enabled.** | `s`, `j`, `J`, `o` |
| `ServerIP` | Destination IP of the server | `s`, `j`, `J`, `o` |
| `ServerPort` | Destination port of the server | `d`, `x`, `f`, `o` |
| `ServicePort` | Service port associated with the application request | `d`, `x`, `f`, `o` |
| `IPProtocol` | IP protocol number | `s`, `j`, `J`, `o` |

### Policy

| Field | Description | Supported format specifiers |
|---|---|---|
| `Policy` | The access policy rule name | `s`, `j`, `J`, `o` |
| `PolicyProcessingTime` | Time in µs taken for processing the access policy associated with the application | `s`, `j`, `J` |

### App Connector and encryption

| Field | Description | Supported format specifiers |
|---|---|---|
| `Connector` | The App Connector name | `s`, `j`, `J`, `o` |
| `ConnectorIP` | Source IP address of the App Connector | `s`, `j`, `J`, `o` |
| `ConnectorPort` | Source port of the App Connector | `d`, `x`, `f`, `o` |
| `ConnectorZEN` | The Public Service Edge that sent the request from the App Connector | `s`, `j`, `J`, `o` |
| `DoubleEncryption` | Double encryption status: `On`, `Off` | `s`, `j`, `J`, `o` |

### Timing

| Field | Description | Supported format specifiers |
|---|---|---|
| `AppLearnTime` | Time in µs for App Connectors to learn about the requested application and report to the central authority | `s`, `j`, `J` |
| `CAProcessingTime` | Time in µs for processing in the central authority | `s`, `j`, `J` |
| `ConnectorZENSetupTime` | Time in µs for setting up the connection between App Connector and Public Service Edge | `s`, `j`, `J` |
| `ConnectionSetupTime` | Time in µs for the App Connector to process a notification from the App Connector selection microservice and set up the connection to the application server | `s`, `j`, `J` |
| `ServerSetupTime` | Time in µs to set up the connection at the server | `s`, `j`, `J` |

### Timestamps

Each timestamp is in microseconds. Per p.10–12:

| Field | Event |
|---|---|
| `TimestampConnectionStart` | Public/Private Service Edge received the initial request from Zscaler Client Connector to start the connection |
| `TimestampConnectionEnd` | Public/Private Service Edge terminated the connection |
| `TimestampCATx` | Central authority sent a request to the Public/Private Service Edge |
| `TimestampCARx` | Central authority received a request from the Public/Private Service Edge |
| `TimestampAppLearnStart` | Private Access services started the process to learn about an application |
| `TimestampConnectorZENSetupComplete` | Public Service Edge received a request from the App Connector to set up a data connection |
| `TimestampZENFirstRxClient` | Public Service Edge received the first byte from Zscaler Client Connector |
| `TimestampZENFirstTxClient` | Public Service Edge sent the first byte to Zscaler Client Connector |
| `TimestampZENLastRxClient` | Public Service Edge received the last byte from Zscaler Client Connector |
| `TimestampZENLastTxClient` | Public Service Edge sent the last byte to Zscaler Client Connector |
| `TimestampZENFirstRxConnector` | Public Service Edge received the first byte from the App Connector |
| `TimestampZENFirstTxConnector` | Public Service Edge sent the first byte to the App Connector |
| `TimestampZENLastRxConnector` | Public Service Edge received the last byte from the App Connector |
| `TimestampZENLastTxConnector` | Public Service Edge sent the last byte to the App Connector |

Format specifiers for the first-byte timestamps are `d`, `x`, `f`, `o`; for the others `s`, `j`, `J`.

### Byte counters

Per p.13–14:

| Field | Description |
|---|---|
| `ZENBytesRxClient` | Additional bytes received from Zscaler Client Connector since the last transaction log |
| `ZENBytesTxClient` | Additional bytes transmitted to Zscaler Client Connector since the last transaction log |
| `ZENBytesRxConnector` | Additional bytes received from the App Connector since the last transaction log |
| `ZENBytesTxConnector` | Additional bytes transmitted by the App Connector since the last transaction log |
| `ZENTotalBytesRxClient` | Total bytes received from Zscaler Client Connector by the Public Service Edge |
| `ZENTotalBytesTxClient` | Total bytes transmitted to Zscaler Client Connector from the Public Service Edge |
| `ZENTotalBytesRxConnector` | Total bytes received from the App Connector by the Public Service Edge |
| `ZENTotalBytesTxConnector` | Total bytes transmitted to the App Connector from the Public Service Edge |

All byte-counter fields support `d`, `x`, `f`, `o` specifiers.

### Privileged Remote Access (PRA) fields

Per pp.7–9. Populated only when the session involves Privileged Remote Access:

| Field | Description |
|---|---|
| `PRAApprovalID` | Privileged approval ID |
| `PRACapabilityPolicyID` | Privileged capabilities policy ID |
| `PRAConnectionID` | PRA connection ID |
| `PRAConsoleType` | `RDP`, `SSH`, `VNC` |
| `PRACredentialLoginType` | `Username/Password`, `SSH Key`, `Password` |
| `PRACredentialPolicyID` | Privileged credential policy ID |
| `PRACredentialUserName` | Name of the user logged in to the target privileged console |
| `PRAErrorStatus` | PRA session error status, if available |
| `PRAFileTransferList` | Files transferred during the PRA session |
| `PRARecordingStatus` | `Available`, `Not Available`, `Started` |
| `PRASessionType` | Expected value: `PRA` |
| `PRASharedMode` | `Monitor`, `Control` |
| `PRASharedUserList` | Users the PRA session was shared with |

## Other LSS log types

Separate schemas; each documented on its own help article. Vendored PDFs we have:

- **User Status** — session authentication/enrollment events. See `vendor/zscaler-help/Understanding_User_Status_Log_Fields.pdf` for field list. (Separate schema doc not authored yet.)
- **App Connector Metrics** — per-connector telemetry. See `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.pdf`. (Separate schema doc not authored yet.)

Not vendored: Audit Logs, App Connector Status, Browser Access, Microsegmentation Flow, Private Cloud Controller Metrics/Status, Private Service Edge Metrics/Status, Web Inspection field references.

## Cross-links

- SPL patterns (including the `segment-match-observed` pattern scoped to `Application` + `Connector` + `Policy`) — [`../../shared/splunk-queries.md`](../../shared/splunk-queries.md)
- ZPA application segment matching (for interpreting the `Application` + `AppGroup` fields) — [`../app-segments.md`](../app-segments.md)
- ZPA access policy precedence (for interpreting the `Policy` field) — [`../policy-precedence.md`](../policy-precedence.md)

## Open questions

- Multi-segment match representation in LSS — [clarification `zpa-01`](../../_clarifications.md#zpa-01-multi-segment-match-representation-in-lss)
