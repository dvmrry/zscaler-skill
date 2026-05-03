---
product: shared
topic: log-export-architecture
title: "Log export architecture — NSS, LSS, Cloud NSS, and where to find each log type"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-nanolog-streaming-service.md"
  - "vendor/zscaler-help/about-cloud-nss-feeds.md"
  - "vendor/zscaler-help/General_Guidelines_for_NSS_Feeds_and_Feed_Formats.txt"
  - "vendor/zscaler-help/Understanding_the_Log_Stream_Content_Format.txt"
  - "references/shared/nss-architecture.md"
  - "references/zcc/logs/zcc-log-schema.md"
  - "references/cloud-connector/logs/log-schema.md"
  - "references/zpa/logs/access-log-schema.md"
  - "references/zia/logs/web-log-schema.md"
author-status: draft
---

# Log export architecture — NSS, LSS, Cloud NSS, and where to find each log type

The "where do I find X log" guide. Covers how logs actually leave each Zscaler product, what format they arrive in, and what the gaps are.

For the detailed NSS pipeline mechanics (buffer behavior, replay windows, feed-count limits), see [`./nss-architecture.md`](./nss-architecture.md) — this file focuses on the per-product picture rather than the NSS internals.

---

## Log export mechanisms by product

| Product | Log type | Export mechanism | Format options | Retention at source | Notes |
|---|---|---|---|---|---|
| ZIA | Web (HTTP/HTTPS transactions) | NSS VM or Cloud NSS | CSV, TSV, JSON, custom | Nanolog retains originals; SIEM holds the customer's copy | ZCC-forwarded traffic carries device fields (`deviceowner`, `ztunnelversion`) |
| ZIA | Firewall sessions | NSS VM or Cloud NSS (Firewall subscription) | CSV, TSV, JSON, custom | Nanolog | DNS and Tunnel logs flow under the Firewall subscription |
| ZIA | DNS queries | NSS VM (Firewall subscription) | CSV, TSV, JSON, custom | Nanolog | Cloud NSS Firewall subscription covers DNS |
| ZIA | Tunnel (GRE/IPSec) events | NSS VM (Firewall subscription) | CSV, TSV, JSON, custom | Nanolog | Not available standalone |
| ZPA | User Activity (per-connection) | LSS receiver (customer-deployed) | JSON, CSV, TSV | LSS retransmit window: 15 minutes (not 60 like NSS) | PascalCase field names; mTLS required |
| ZPA | User Status (session auth/enrollment) | LSS receiver | JSON, CSV, TSV | 15-minute retransmit window | Carries ZCC version, posture results |
| ZPA | App Connector Status, Metrics | LSS receiver | JSON, CSV, TSV | 15-minute retransmit window | Connector health and throughput telemetry |
| ZPA | Browser Access, Audit Logs, others | LSS receiver | JSON, CSV, TSV | 15-minute retransmit window (Audit Logs: always retransmitted) | 12 log types total from LSS |
| ZCC | Diagnostic/operational logs | Local device only — no stream | Flat file (ZCC proprietary format on older builds; plaintext ZIP on ZCC 2.1.2+) | Device disk (rotated by `logFileSize`) | Not SIEM-accessible; must be exported as bundle |
| ZDX | Score and probe metrics | ZDX REST API (pull) or ZDX Splunk Add-on (if installed) | JSON (API) | Zscaler Azure Data Explorer; time-series, not archival | No NSS/LSS path; pull-only |
| Cloud Connector | Session logs | NSS for Firewall (same path as ZIA FW) | CSV, TSV, JSON, custom | Nanolog | ZIA NSS for Web does not apply to CC |
| Cloud Connector | Insights (Session, DNS, Tunnel) | ZTW admin console UI only | UI display | 92-day time picker | No confirmed API or SIEM export path |

---

## ZIA — NSS (VM-based)

### Architecture

```
ZIA Public Service Edges / Firewall module
         ↓
     Nanolog cluster          (Zscaler-hosted; retains originals)
         ↓  (secure tunnel; streams compressed copies)
     NSS virtual appliance    (customer-deployed — Azure, AWS, vSphere)
         ↓  (decompress → detokenize → filter → format → TCP)
     Customer SIEM
```

The Nanolog retains the authoritative log copies; NSS streams **copies**. A misconfigured or offline NSS creates a gap in the SIEM stream, but the Nanolog originals are preserved (within the one-hour replay window, if that capability is enabled via Zscaler Support).

### What it captures

| Log type | NSS subscription |
|---|---|
| Web (HTTP/HTTPS transactions) | NSS for Web |
| Mobile traffic logs | NSS for Web |
| Firewall sessions, NAT events, IPS events | NSS for Firewall |
| DNS queries | NSS for Firewall |
| GRE/IPSec tunnel events | NSS for Firewall |

DNS and tunnel logs are not available under the NSS for Web subscription — they require NSS for Firewall.

### Format options

CEF, LEEF, JSON, CSV, TSV, and custom string templates using `%s{field}` / `%d{field}` placeholders. JSON is recommended for new deployments (preserves type information; maps more reliably to SIEM CIM schemas).

**Field delimiter guidance**: use tabs as field delimiters when using CSV/TSV — URL values and department names may contain commas. If commas must be used, configure the Feed Escape Character so the service hex-encodes them. Recommended maximum of 50 fields per feed to stay within syslog message size limits.

### Delivery model

- Transport: raw TCP from the NSS VM to the SIEM listener
- Delivery guarantee: at-least-once (VM buffers in memory; replays on SIEM reconnect per the Duplicate Logs setting)
- Nanolog replay: optional one-hour recovery window (requires a Zscaler Support ticket to enable — not on by default)

### NSS VM sizing and deployment

The NSS VM is a Zscaler-provided virtual appliance deployed in the customer's network (on-prem or cloud). Key constraints:

- Each NSS VM connects to exactly one Nanolog cluster
- Nanolog clusters have a throughput ceiling (approximately 1 billion web transactions per cluster); high-volume tenants exceeding that ceiling need additional Nanolog clusters and NSS VMs
- Feed limits: 16 feeds per NSS server, split as 8 Web feeds and 8 Firewall feeds maximum
- TLS certificate issued by Zscaler on NSS VM creation — authenticates the VM to the Nanolog stream
- Supported hypervisors: VMware ESXi, AWS, Azure

For deployment: ZIA Admin Console > Administration > Nanolog Streaming Service.

---

## ZIA — Cloud NSS

Cloud NSS is the SaaS alternative to deploying an NSS VM. Zscaler's cloud directly POSTs batches of logs to an HTTPS endpoint at the customer's SIEM — no on-prem appliance required.

### How it differs from NSS VM

| | VM-based NSS | Cloud NSS |
|---|---|---|
| Where it runs | Customer-managed VM | Zscaler-hosted; no on-prem component |
| Transport | Raw TCP | HTTPS POST |
| On-prem buffer on SIEM failure | VM memory | None — connection failure = data gap for up to 1 hour, then batch is dropped |
| Nanolog replay on connectivity loss | 1-hour recovery (opt-in via Support ticket) | 1-hour recovery (opt-in; separate capability from VM-based) |
| Feed limit | 16 per server (8 Web + 8 FW) | 1 feed per log type per Cloud NSS instance |
| Monitoring | Customer-operated VM | Zscaler CloudOps 24/7 |
| Subscription | Separate SKU | Separate SKU from VM-based NSS |

The 1-feed-per-log-type-per-instance limit is the key operational constraint. Sending the same Web logs to two different SIEMs (e.g., production Splunk and a DR Sentinel) requires two Cloud NSS instances, not two feeds on one instance.

### Supported destinations

Cloud NSS pushes to any HTTPS endpoint that exposes a stateless log ingestion API. Examples confirmed in the Zscaler documentation:

- Splunk HTTP Event Collector (HEC)
- Azure Sentinel / Azure Monitor HTTPS collector
- Sumo Logic HTTP Source
- Any SIEM or data pipeline that accepts HTTPS POST and returns standard HTTP response codes

### Feed configuration

Cloud NSS feeds are configured from the NSS Feeds page (Logs > Log Streaming > Internet Log Streaming - Nanolog Streaming Service). Each feed specifies:

- Log type (Web or Firewall)
- Log filter criteria (by user, department, location, threat category, etc.)
- Feed output format (JSON recommended)
- HTTPS endpoint URL and authentication headers
- Batch size and delivery behavior

**HTTP response code behavior**:
- 200 / 204: batch considered successfully uploaded
- 400: parsing error — batch dropped immediately
- Any other code (401, 403, 501, etc.): Cloud NSS retries for up to one hour, then drops the batch

---

## ZPA — LSS (Log Streaming Service)

LSS is ZPA's log streaming layer. It is architecturally distinct from NSS — it does not go through the Nanolog cluster and is configured in the ZPA admin console, not the ZIA admin console.

### Architecture

```
ZPA cloud (per-session activity, user status, connector telemetry)
         ↓  (TLS connection; mTLS required for the receiver)
     LSS log receiver         (customer-deployed TCP listener; or managed log-receiver service)
         ↓
     Customer SIEM
```

The LSS receiver is a customer-deployed component (not a Zscaler appliance) that accepts the TLS connection from the ZPA cloud. It can be a syslog server, a Splunk forwarder, a log aggregation appliance, or any service that accepts raw TCP. The receiver is typically co-located with or in the same network segment as App Connectors.

### Log types

LSS emits 12 log types (per *Understanding the Log Stream Content Format*):

| Log type | What it covers | Schema doc |
|---|---|---|
| **User Activity** | Per-connection records: application, connector, policy, timing, bytes | [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md) |
| **User Status** | ZCC authentication state, posture evaluation, session enrollment | [`../zpa/logs/user-status-log-schema.md`](../zpa/logs/user-status-log-schema.md) |
| **App Connector Metrics** | Per-connector CPU, memory, throughput, connection counts | [`../zpa/logs/app-connector-metrics.md`](../zpa/logs/app-connector-metrics.md) |
| App Connector Status | App Connector lifecycle events | Schema not yet documented |
| Browser Access | Browser-based ZPA access sessions | Schema not yet documented |
| Audit Logs | Admin console change audit | Schema not yet documented |
| Microsegmentation Flow | Microsegmentation-specific flow records | Schema not yet documented |
| Private Cloud Controller Metrics/Status | PCC telemetry | Schema not yet documented |
| Private Service Edge Metrics/Status | PSE telemetry | Schema not yet documented |
| Web Inspection | App-level inspection events | Schema not yet documented |

### Format

JSON, CSV, or TSV. **Field names in ZPA LSS are PascalCase** (e.g., `Username`, `Application`, `Connector`, `ConnectionStatus`) — a material difference from ZIA NSS (lowercase, e.g., `login`, `host`, `action`). SPL patterns must use the correct case.

### Delivery model

- Transport: TLS (mTLS required — the LSS receiver must present a client certificate)
- Delivery guarantee: **at-least-once, with a 15-minute retransmit window** (fixed platform behavior; not opt-in)
- Logs generated during an outage longer than 15 minutes are permanently lost from the LSS stream
- **Exception**: Audit Logs are retransmitted regardless of the 15-minute window

The shorter retransmit window compared to NSS (15 min vs 60 min opt-in) is a gotcha. A 30-minute App Connector outage = approximately 15 minutes of permanent ZPA log gap.

---

## ZCC — Local diagnostic logs

ZCC does not stream logs to any external receiver. All ZCC operational logs are written to the endpoint device and accessed locally or via support bundle export.

### Access methods

| Method | Who can use it | Notes |
|---|---|---|
| In-app log viewer (ZCC More window) | End user — when logging controls are not hidden | Shows current log at active verbosity |
| Export as ZIP | End user — when `exportLogsForNonAdmin` is enabled | Plaintext-readable on ZCC 2.1.2+; encrypted on earlier versions |
| Report an Issue (email bundle) | End user — always | Bundle is always encrypted; user cannot read it |
| ZCC Portal diagnostic bundle | Admin | Full on-disk logs at current verbosity, regardless of user-facing control visibility |
| Direct file access | Local OS admin | `grantAccessToZscalerLogFolder` in WebPrivacy controls non-admin access to the log directory |

Log verbosity is set by `logMode` in the App Profile (`WebPolicy`): Error, Warn, Info, Debug. Changes take effect only on ZCC restart or user re-login — no real-time push.

### What ZCC logs contain vs what ZIA/ZPA logs contain

ZCC logs are transport-layer; ZIA logs are application-layer. This split is a common source of misdirection.

| Data element | ZCC log | ZIA NSS / ZPA LSS |
|---|---|---|
| Tunnel establishment/teardown | Yes (Info+) | — |
| Z-Tunnel version (1.0 vs 2.0) | Yes (Info+) | ZIA Web/FW: `ztunnelversion` |
| Forwarding profile branch switches | Yes (Info+) | — |
| ZPA connector selected for session | Yes (Debug) | ZPA User Activity: `Connector` |
| Device posture evaluation result | Yes (Warn+) | ZPA User Status: `PosturesMiss` / `PosturesHit` |
| Individual web transaction URL | No | ZIA Web: `url`, `host` |
| HTTP response code | No | ZIA Web: `respcode` |
| Policy action (allow/block) | No | ZIA Web: `action`, `rulelabel` |
| DLP event | No | ZIA Web: `dlpdict`, `dlpeng` |
| ZPA application access (per-session) | No | ZPA User Activity: `Application`, `ConnectionStatus` |

When a user reports "ZCC is blocking my site," the block decision likely lives in ZIA web logs rather than ZCC logs — ZCC logs are transport-layer (per the table above) and do not record per-URL policy actions. For URL-level investigation, use ZIA NSS web logs.

ZCC device identity surfaces indirectly in ZIA NSS web logs via `deviceowner` (device's registered owner) and `ztunnelversion` — these fields carry device context without requiring ZCC log export.

---

## Cloud Connector — NSS Firewall + Insights UI

Cloud Connector (CC, the workload proxy product — distinct from ZPA App Connectors) produces logs through two paths:

### NSS for Firewall (SIEM path)

CC session logs use the **NSS for Firewall** subscription — the same schema as ZIA firewall logs. ZIA NSS for Web does not apply to Cloud Connector; only NSS for Firewall carries CC sessions.

Steps to enable:
1. Subscribe to NSS for Firewall (separate entitlement from NSS for Web)
2. Deploy an NSS virtual appliance (or use Cloud NSS if available)
3. Configure a log receiver in the ZTW admin console pointing to the NSS appliance
4. Filter by `location` (the CBC location object associated with the CC group) to isolate CC traffic from branch ZIA traffic in the SIEM

Key fields for CC context in the firewall log stream:
- `location` — the CBC location; primary filter key for CC traffic
- `ttype` — traffic forwarding method (`L2 tunnel` for CC)
- `fwd_type` — `Direct`, `ZIA`, or `ZPA`
- `csip` / `cdip` / `cdport` — workload source, destination IP, destination port

Traffic with `fwd_type=Direct` bypasses ZIA entirely — CC session logs in the NSS Firewall stream are the only centralized record. ZIA Web Insights will show gaps for Direct-forwarded workload traffic; this is expected.

### Insights UI (no SIEM export path)

The ZTW admin console Insights pages (Session Insights, DNS Insights, Tunnel Insights) provide up to a 92-day window of per-session, per-DNS-transaction, and per-tunnel metrics via the UI only. No API or SIEM export path has been confirmed for Insights data.

---

## The "what stream has field X" quick-reference table

Fields that operators commonly search for and which log stream carries them. NSS specifiers (without `%s{}` wrapper) are used for ZIA fields; ZPA uses PascalCase field names.

| Field concept | ZIA Web | ZIA Firewall | ZIA DNS | ZPA User Activity | ZPA User Status |
|---|---|---|---|---|---|
| Username / user identity | `login` | `login` | `login` | `Username` | `Username` |
| Device owner (ZCC-enrolled) | `deviceowner` | `deviceowner` | `deviceowner` | — | — |
| Device hostname | `devicehostname` | `devicehostname` | `devicehostname` | `Hostname` | `Hostname` |
| Device OS type | `deviceostype` | `deviceostype` | `deviceostype` | `Platform` | `Platform` |
| ZCC client version | `deviceappversion` | `deviceappversion` | `deviceappversion` | — | `Version` |
| Z-Tunnel version | `ztunnelversion` | `ztunnelversion` | — | — | — |
| Destination URL | `url` | — | — | — | — |
| Destination hostname | `host` | `cdfqdn` | `req` (FQDN) | `Host` | — |
| Destination IP | `sip` | `cdip` / `sdip` | `sip` | `ServerIP` | — |
| Destination port | `srv_dport`* | `cdport` / `sdport` | `sport` | `ServerPort` | — |
| Client / source IP | `cip` | `csip` | `cip` | `ClientPublicIP` / `ClientPrivateIP` | — |
| Action taken | `action` | `action` | `reqaction` / `resaction` | `ConnectionStatus` | `SessionStatus` |
| Rule fired | `urlfilterrulelabel` (URL filter) / `apprulelabel` (CAC) / `rulelabel` (block-only) | `rulelabel` | `reqrulelabel` / `resrulelabel` | `Policy` | — |
| Cloud app / network app | `appname` | `nwapp` | `dnsapp` | `Application` | — |
| App group / segment group | — | — | — | `AppGroup` | — |
| App Connector | — | — | — | `Connector` | — |
| SSL inspected? | `ssldecrypted` | — | — | — | — |
| SSL bypass reason | `externalspr` | — | — | — | — |
| Traffic forwarding method | `trafficredirectmethod` | `ttype` / `fwd_type` | — | — | — |
| ZPA app segment (in ZIA logs) | `zpa_app_seg_name` | `zpa_app_seg_name` | — | — | — |
| Posture profiles missed | — | — | — | — | `PosturesMiss` |
| Posture profiles matched | — | — | — | — | `PosturesHit` |
| Department | `dept` | `dept` | `dept` | — | — |
| Zscaler location | `location` | `location` | `location` | — | — |
| Bytes sent (client→server) | `reqsize` | `outbytes` | — | `ZENBytesTxClient` | — |
| Bytes received (server→client) | `respsize` | `inbytes` | — | `ZENBytesRxClient` | — |
| Epoch timestamp | `epochtime` | `epochtime` | `epochtime` | `LogTimestamp` (multiple format variants) | — |

`*` `srv_dport` requires Zscaler Support enablement; not logged by default in ZIA Web.

### Key cross-stream join fields

- **Username**: ZIA uses `login`; ZPA uses `Username` — same email-format value, different field name. In SPL: `coalesce(login, Username)` normalizes across streams.
- **Device identity**: ZIA carries `deviceowner` (ZCC device's registered owner); ZPA User Status carries `Hostname` (device hostname reported by ZCC). These are different identifiers; both can be in the same SIEM query but require separate field references.
- **Epoch time**: all streams carry an epoch timestamp (`epochtime` in ZIA; `LogTimestamp` formatted as epoch in ZPA). Use with ±30 second tolerance for cross-stream joins on the same transaction.

---

## Where to find each log type

| "I need logs for..." | Log source | Export path |
|---|---|---|
| ZIA web (HTTP/HTTPS) transactions | ZIA NSS Web feed | VM-based NSS or Cloud NSS |
| ZIA firewall sessions | ZIA NSS Firewall feed | VM-based NSS or Cloud NSS |
| ZIA DNS queries | ZIA NSS Firewall feed (DNS is a sub-type) | VM-based NSS or Cloud NSS |
| ZIA tunnel events (GRE/IPSec) | ZIA NSS Firewall feed (Tunnel sub-type) | VM-based NSS or Cloud NSS |
| ZIA DLP, SaaS Security, Sandbox events | ZIA NSS Web feed (DLP/sandbox fields in web log) | VM-based NSS or Cloud NSS |
| ZPA application connections (per-session) | ZPA LSS User Activity | LSS receiver |
| ZPA auth / ZCC enrollment / posture state | ZPA LSS User Status | LSS receiver |
| ZPA App Connector health/metrics | ZPA LSS App Connector Metrics | LSS receiver |
| ZPA admin audit trail | ZPA LSS Audit Logs | LSS receiver |
| ZCC tunnel/auth debug | ZCC local device logs | Manual export / ZCC Portal bundle |
| ZDX performance scores and probe data | ZDX API | Custom pipeline (poll ZDX API → SIEM HEC) |
| Cloud Connector session logs | ZIA NSS Firewall feed (filter by CC location) | VM-based NSS or Cloud NSS |
| Cloud Connector Insights (UI) | ZTW admin console | UI only; no export path confirmed |

---

## Cross-links

- NSS architecture deep-dive (VM-based vs Cloud NSS, feed configuration, filter caps, replay behavior) — [`./nss-architecture.md`](./nss-architecture.md)
- SPL patterns for querying all of the above — [`./splunk-queries.md`](./splunk-queries.md)
- Log correlation (when to use which log for which question) — [`./log-correlation.md`](./log-correlation.md)
- ZIA web log schema (full field inventory) — [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md)
- ZIA firewall log schema — [`../zia/logs/firewall-log-schema.md`](../zia/logs/firewall-log-schema.md)
- ZIA DNS log schema — [`../zia/logs/dns-log-schema.md`](../zia/logs/dns-log-schema.md)
- ZPA LSS User Activity schema — [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md)
- ZPA User Status schema — [`../zpa/logs/user-status-log-schema.md`](../zpa/logs/user-status-log-schema.md)
- ZPA App Connector Metrics schema — [`../zpa/logs/app-connector-metrics.md`](../zpa/logs/app-connector-metrics.md)
- ZCC log schema (client-side, not SIEM-accessible) — [`../zcc/logs/zcc-log-schema.md`](../zcc/logs/zcc-log-schema.md)
- ZDX API (data retrieval) — [`../zdx/api.md`](../zdx/api.md)
- Cloud Connector log fields and access methods — [`../cloud-connector/logs/log-schema.md`](../cloud-connector/logs/log-schema.md)
