---
product: zpa
topic: "zpa-logs/browser-access-log-schema"
title: "ZPA LSS Browser Access log — field reference"
content-type: reference
last-verified: "2026-05-06"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-browser-access-log-fields"
author-status: draft
---

# ZPA LSS Browser Access log — field reference

Browser Access logs are emitted by LSS for every HTTP/HTTPS transaction handled by the ZPA Browser Access service — the component that enables clientless, browser-based access to private applications without ZCC. One record is generated per HTTP request/response cycle. The log provides detailed per-transaction timing (broken into request-receive, request-transmit, response-receive, and response-transmit phases), HTTP metadata (method, protocol, status code, URL, user agent), and identity (the SAML NameID from the IdP assertion). Browser Access logs differ from User Activity logs in two ways: they are HTTP-layer records (not TCP-connection records), and they identify users by SAML `NameID` rather than ZCC-authenticated `Username`.

## Example log record

```json
{
  "LogTimestamp": "Fri Oct  8 18:30:01 2021",
  "ConnectionID": "ab3d72e0-1c4f-4b8c-9d2a-5f6e7a8b9c0d",
  "Exporter": "zpa-brkr-us-east-1",
  "TimestampRequestReceiveStart": "1633714200000000",
  "TimestampRequestReceiveHeaderFinish": "1633714200001200",
  "TimestampRequestReceiveFinish": "1633714200001500",
  "TimestampRequestTransmitStart": "1633714200002000",
  "TimestampRequestTransmitFinish": "1633714200003000",
  "TimestampResponseReceiveStart": "1633714200050000",
  "TimestampResponseReceiveFinish": "1633714200075000",
  "TimestampResponseTransmitStart": "1633714200076000",
  "TimestampResponseTransmitFinish": "1633714200090000",
  "TotalTimeRequestReceive": "1500",
  "TotalTimeRequestTransmit": "1000",
  "TotalTimeResponseReceive": "25000",
  "TotalTimeResponseTransmit": "14000",
  "TotalTimeConnectionSetup": "2000",
  "TotalTimeServerResponse": "47000",
  "Method": "GET",
  "Protocol": "HTTP/1.1",
  "Host": "myapp.example.com",
  "URL": "/api/data",
  "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "XFF": "203.0.113.42",
  "NameID": "jsmith@example.com",
  "StatusCode": "200",
  "RequestSize": "512",
  "ResponseSize": "8192",
  "ApplicationPort": "443",
  "ClientPublicIp": "203.0.113.42",
  "ClientPublicPort": "54321",
  "ClientPrivateIp": "192.168.1.100",
  "Customer": "Acme Corp",
  "ConnectionStatus": "SUCCESS",
  "ConnectionReason": ""
}
```

## Field reference

| Field | Type | Description |
|---|---|---|
| `LogTimestamp` | string | Timestamp when the log was generated. Format specifiers: `s`, `j`, `J`. |
| `ConnectionID` | string | The application connection ID. Format specifiers: `s`, `j`, `J`, `o`. |
| `Exporter` | string | The Browser Access service instance (identifies which Public or Private Service Edge handled this transaction). Format specifiers: `s`, `j`, `J`, `o`. |
| `TimestampRequestReceiveStart` | string | Timestamp (microseconds) when Browser Access service received the first byte of the HTTP request from the browser. Format specifiers: `s`, `j`, `J`. |
| `TimestampRequestReceiveHeaderFinish` | string | Timestamp (microseconds) when Browser Access service received the last byte of the HTTP request headers. Format specifiers: `s`, `j`, `J`. |
| `TimestampRequestReceiveFinish` | string | Timestamp (microseconds) when Browser Access service received the last byte of the full HTTP request from the browser. Format specifiers: `s`, `j`, `J`. |
| `TimestampRequestTransmitStart` | string | Timestamp (microseconds) when Browser Access service sent the first byte of the HTTP request to the backend web server. Format specifiers: `s`, `j`, `J`. |
| `TimestampRequestTransmitFinish` | string | Timestamp (microseconds) when Browser Access service sent the last byte of the HTTP request to the backend web server. Format specifiers: `s`, `j`, `J`. |
| `TimestampResponseReceiveStart` | string | Timestamp (microseconds) when Browser Access service received the first byte of the HTTP response from the backend web server. Format specifiers: `s`, `j`, `J`. |
| `TimestampResponseReceiveFinish` | string | Timestamp (microseconds) when Browser Access service received the last byte of the HTTP response from the backend web server. Format specifiers: `s`, `j`, `J`. |
| `TimestampResponseTransmitStart` | string | Timestamp (microseconds) when Browser Access service sent the first byte of the HTTP response to the browser. Format specifiers: `s`, `j`, `J`. |
| `TimestampResponseTransmitFinish` | string | Timestamp (microseconds) when Browser Access service sent the last byte of the HTTP response to the browser. Format specifiers: `s`, `j`, `J`. |
| `TotalTimeRequestReceive` | number | Time (microseconds) to receive the full HTTP request from browser (finish − start). Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalTimeRequestTransmit` | number | Time (microseconds) to transmit the full HTTP request to the backend server. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalTimeResponseReceive` | number | Time (microseconds) to receive the full HTTP response from the backend server. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalTimeResponseTransmit` | number | Time (microseconds) to transmit the full HTTP response to the browser. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalTimeConnectionSetup` | number | Time (microseconds) from first byte of browser request to first byte sent toward backend — captures proxy overhead and backend connection setup. Format specifiers: `d`, `x`, `f`, `o`. |
| `TotalTimeServerResponse` | number | Time (microseconds) from last byte of request sent to backend to first byte of response received — pure backend TTFB. Format specifiers: `d`, `x`, `f`, `o`. |
| `Method` | string | HTTP request method (e.g., `GET`, `POST`, `PUT`). Format specifiers: `s`, `j`, `J`, `o`. |
| `Protocol` | string | HTTP protocol version (e.g., `HTTP/1.1`, `HTTP/2`). Format specifiers: `s`, `j`, `J`, `o`. |
| `Host` | string | The web application hostname from the HTTP Host header. Format specifiers: `s`, `j`, `J`, `o`. |
| `URL` | string | The URL path (and query string) requested by the user. Format specifiers: `s`, `j`, `J`, `o`. |
| `UserAgent` | string | User agent string from the HTTP request header. Format specifiers: `s`, `j`, `J`, `o`. |
| `XFF` | string | X-Forwarded-For header value — the client's original IP address as seen upstream. Format specifiers: `s`, `j`, `J`, `o`. |
| `NameID` | string | The SAML NameID received by ZPA in the SAML assertion from the IdP — the user identity for Browser Access sessions. Format specifiers: `s`, `j`, `J`, `o`. |
| `StatusCode` | number | HTTP response status code (e.g., `200`, `403`, `500`). Format specifiers: `d`, `x`, `f`, `o`. |
| `RequestSize` | number | Size of the HTTP request in bytes. Format specifiers: `d`, `x`, `f`, `o`. |
| `ResponseSize` | number | Size of the HTTP response in bytes. Format specifiers: `d`, `x`, `f`, `o`. |
| `ApplicationPort` | number | Backend application server port. Format specifiers: `d`, `x`, `f`, `o`. |
| `ClientPublicIp` | string | Public IP address of the user's device. Format specifiers: `s`, `j`, `J`, `o`. |
| `ClientPublicPort` | number | Source TCP port used by the user's device. Format specifiers: `d`, `x`, `f`, `o`. |
| `ClientPrivateIp` | string | Private IP address of the user's device (if available). Format specifiers: `s`, `j`, `J`, `o`. |
| `Customer` | string | The customer (tenant) name. Format specifiers: `s`, `j`, `J`, `o`. |
| `ConnectionStatus` | string | Connection status (e.g., `SUCCESS`, `FAILED`). Format specifiers: `s`, `j`, `J`, `o`. |
| `ConnectionReason` | string | Internal reason code when a connection fails or is blocked. Format specifiers: `s`, `j`, `J`, `o`. |
| `CorsToken` | string | Token from a CORS preflight request. Only present for CORS requests. Format specifiers: `s`. |
| `Origin` | string | The Browser Access domain that originated a CORS request. Only present for CORS requests. Format specifiers: `s`. |

## Splunk SPL patterns

### `browser-access-slow-backend`

**Purpose:** Identify Browser Access applications with high backend response time (TTFB) — separates user-perceived slowness caused by the backend from ZPA proxy overhead.

```spl
index=$INDEX_ZPA_BA earliest=-1h
| eval ttfb_ms = round(TotalTimeServerResponse / 1000, 1)
| eval proxy_overhead_ms = round(TotalTimeConnectionSetup / 1000, 1)
| stats
    avg(ttfb_ms) as avg_ttfb_ms
    p95(ttfb_ms) as p95_ttfb_ms
    avg(proxy_overhead_ms) as avg_proxy_ms
    count as requests
    by Host
| where avg_ttfb_ms > 500
| sort -p95_ttfb_ms
| rename avg_ttfb_ms as "Avg TTFB ms", p95_ttfb_ms as "p95 TTFB ms", avg_proxy_ms as "Avg Proxy Overhead ms"
```

`TotalTimeServerResponse` is pure backend latency. `TotalTimeConnectionSetup` is ZPA proxy overhead. If `avg_ttfb_ms` is high but `avg_proxy_ms` is low, the backend is the bottleneck — not ZPA.

### `browser-access-error-rate`

**Purpose:** Find Browser Access applications with elevated HTTP 4xx/5xx error rates.

```spl
index=$INDEX_ZPA_BA earliest=-30m
| eval status_class = case(
    StatusCode >= 500, "5xx",
    StatusCode >= 400, "4xx",
    StatusCode >= 300, "3xx",
    StatusCode >= 200, "2xx",
    true(), "other"
  )
| stats count by Host status_class
| eval pct = round(count / sum(count) * 100, 1)
| where status_class IN ("4xx", "5xx")
| sort -count
| table Host status_class count pct
```

## What the spec underspecifies — don't infer

Two fields where the example value gives a hint at the enum but the full set is undocumented:

- **`ConnectionStatus`** — example shows `SUCCESS`, the doc lists `SUCCESS, FAILED` as illustrative. The full enum (intermediate states like in-progress, timeout, redirect, partial-success) is not stated.
- **`ConnectionReason`** — described as "Internal reason code when a connection fails or is blocked" with no example values. For SIEM rules routing on specific failure types (auth failures vs backend unreachable vs policy-block), the full enum is necessary.

See [`log-20`](../../_meta/clarifications.md#log-20-browser-access-connectionstatus-connectionreason-enum-completeness).

The byte-counter and SSL-decryption-perspective questions documented for ZPA User Activity logs ([`zpa-17`](../../_meta/clarifications.md#zpa-17-delta-vs-total-byte-counter-reset-semantics)) and ZIA web logs ([`log-09`](../../_meta/clarifications.md#log-09-byte-counter-perspective-and-compressionconnect-semantics)) likely apply here too — `RequestSize` / `ResponseSize` measurement point and compression handling are not specified.

## Open questions

- `ConnectionStatus` and `ConnectionReason` enum completeness — [clarification `log-20`](../../_meta/clarifications.md#log-20-browser-access-connectionstatus-connectionreason-enum-completeness)

## Cross-links

- ZPA User Activity log schema (ZCC-based access; `Username` vs `NameID` identity difference) — [`./access-log-schema.md`](./access-log-schema.md)
- ZPA User Status log schema (ZCC authentication and posture) — [`./user-status-log-schema.md`](./user-status-log-schema.md)
- ZPA App Connector Status log schema (connector-to-service-edge session health) — [`./app-connector-status.md`](./app-connector-status.md)
