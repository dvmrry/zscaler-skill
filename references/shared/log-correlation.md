---
product: shared
topic: "log-correlation"
title: "Cross-product log correlation — ZIA, ZPA, ZCC join fields and patterns"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/nss-web-logs.csv"
  - "vendor/zscaler-help/nss-firewall-logs.csv"
  - "vendor/zscaler-help/nss-dns-logs.csv"
  - "vendor/zscaler-help/about-log-streaming-service.md"
  - "references/zia/logs/web-log-schema.md"
  - "references/zia/logs/firewall-log-schema.md"
  - "references/zia/logs/dns-log-schema.md"
  - "references/zpa/logs/access-log-schema.md"
  - "references/shared/splunk-queries.md"
author-status: draft
---

# Cross-product log correlation — ZIA, ZPA, ZCC join fields and patterns

This document covers the shared fields across ZIA log streams (web, firewall, DNS), the join keys that link ZIA logs to ZPA (LSS) logs and ZCC client-side events, the log streaming service architecture for each product, and practical correlation patterns for multi-product incident investigation.

## When to consult logs vs config

Logs are a **validation layer**, not the primary source. The default answer sequence is:

1. **Config answer first.** Derive the expected answer from `_data/snapshot/` + `references/` docs with appropriate confidence.
2. **Validate with logs only when triggered** by user pushback, ambiguous config, an inherently observational question, or suspected config/reality drift.
3. **Report drift explicitly.** If logs contradict config, that is the high-signal finding.

Consult logs when: the user pushes back, config is ambiguous, the question is observational ("when did this start?", "how many per day?"), or a stale config/activation lag is suspected. Do not run log queries for pure semantic questions ("how do wildcards work?") or freshly-changed config not yet in the log stream.

The skill emits SPL for validation rather than auto-executing queries. The operator runs the query; the skill produces the right query to run. See [`./splunk-queries.md`](./splunk-queries.md) for the pattern catalog.

---

## Log streaming architecture

### ZIA — NSS (Nanolog Streaming Service)

ZIA uses NSS (Nanolog Streaming Service) to stream traffic logs from the Zscaler Nanolog to a SIEM. NSS is the authoritative log path for ZIA web, firewall, and DNS events (Tier A — vendor/zscaler-help/about-log-streaming-service.md).

NSS produces three separate log streams, each with its own field schema:

| Stream | Feed type | Schema reference |
|---|---|---|
| Web logs | NSS for Web | [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md) |
| Firewall logs | NSS for Firewall | [`../zia/logs/firewall-log-schema.md`](../zia/logs/firewall-log-schema.md) |
| DNS logs | NSS for DNS | [`../zia/logs/dns-log-schema.md`](../zia/logs/dns-log-schema.md) |

NSS streams are configured per-feed with a custom format template (the `%s{field}` / `%d{field}` specifiers). The Zscaler cloud retains traffic logs for a rolling 14-day period. For retention beyond 14 days, NSS streaming to a SIEM is required (Tier A — vendor/zscaler-help/about-log-streaming-service.md).

**Cloud NSS vs legacy NSS:** ZIA offers both a Cloud NSS (cloud-hosted, no on-prem appliance required) and a legacy NSS (VM appliance). Both produce the same field set. Cloud NSS is the current recommended approach.

### ZPA — LSS (Log Streaming Service)

ZPA uses LSS (Log Streaming Service) for its equivalent function. LSS streams through a ZPA Public Service Edge to an App Connector, which forwards to the log receiver. Twelve log types are available; the primary access log is **User Activity** (Tier A — vendor/zscaler-help/about-log-streaming-service.md):

| LSS log type | What it covers |
|---|---|
| User Activity | Per-connection records: application segment, access policy, App Connector outcome |
| User Status | End-user connection state to ZPA |
| App Connector Metrics | App Connector performance data |
| App Connector Status | App Connector availability |
| Audit Logs | Admin console actions (6-month retention) |
| Browser Access Logs | HTTP log records for Browser Access sessions |
| AppProtection | AppProtection policy activity |
| Microsegmentation | Microsegmentation flow activity |

LSS retention: Zscaler retains User Activity, User Status, and App Connector logs for a rolling **14 days**. Audit logs are retained for **6 months**. For access beyond these windows, LSS streaming is required (Tier A — vendor/zscaler-help/about-log-streaming-service.md).

**mTLS encryption**: LSS supports mutual TLS between the App Connector and the log receiver. The log receiver must have a certificate signed by a public root CA. The App Connector trusts public root CAs and custom CAs used as its enrollment certificate.

**Delivery guarantee**: LSS does not guarantee delivery during a connection loss. After reconnection, it can retransmit the **last 15 minutes** of log data, but delivery of that retransmitted data is not guaranteed. Audit log data is not retransmitted after a connection loss (Tier A — vendor/zscaler-help/about-log-streaming-service.md).

### ZCC — client-side operational logs (not streamed)

ZCC does not produce a SIEM-streamable log feed equivalent to NSS or LSS. ZCC writes operational logs to the endpoint device. These cover tunnel events, auth events, posture checks, and forwarding decisions — not individual web transactions (that is ZIA-side). Administrators access ZCC logs via the ZCC Portal diagnostic bundle or user-exported ZIP. See [`../zcc/logs/zcc-log-schema.md`](../zcc/logs/zcc-log-schema.md) and [`../zcc/user-logging-controls.md`](../zcc/user-logging-controls.md).

---

## Shared fields across ZIA web, firewall, and DNS logs

The following fields appear in all three ZIA NSS streams with the same semantics. These are the universal ZIA correlation keys (Tier A — vendor/zscaler-help/nss-web-logs.csv; vendor/zscaler-help/nss-firewall-logs.csv; vendor/zscaler-help/nss-dns-logs.csv):

| Field | Web log specifier | Firewall log specifier | DNS log specifier | Description |
|---|---|---|---|---|
| Timestamp | `%s{time}` | `%s{time}` | `%s{time}` | Wall-clock time (no timezone); pair with `%s{tz}` |
| Epoch time | `%d{epochtime}` | `%d{epochtime}` | `%d{epochtime}` | Seconds since Unix epoch — the reliable join key across feeds |
| User login | `%s{login}` | `%s{login}` | `%s{login}` | User's email-format login name |
| Department | `%s{dept}` | `%s{dept}` | `%s{dept}` | Department of the user |
| Location | `%s{location}` | `%s{location}` | `%s{location}` | Gateway location or sub-location |
| Client IP | `%s{cip}` | `%s{csip}` | `%s{cip}` | Client source IP (internal if visible via GRE; else NATed public IP) |
| Data center | `%s{datacenter}` | `%s{datacenter}` | `%s{datacenter}` | Name of the ZIA data center that processed the transaction |
| DC city | `%s{datacentercity}` | `%s{datacentercity}` | `%s{datacentercity}` | City of the data center |
| ZCC device hostname | `%s{devicehostname}` | `%s{devicehostname}` | `%s{devicehostname}` | Hostname of the device (ZCC-forwarded traffic only) |
| ZCC device owner | `%s{deviceowner}` | `%s{deviceowner}` | `%s{deviceowner}` | Owner of the ZCC device |
| ZCC OS type | `%s{deviceostype}` | `%s{deviceostype}` | `%s{deviceostype}` | Device OS: `iOS`, `Android OS`, `Windows OS`, `MAC OS`, `Other OS` |
| ZCC tunnel version | `%s{ztunnelversion}` | `%s{ztunnelversion}` | — | Z-Tunnel version: `ZTUNNEL_1_0` or `ZTUNNEL_2_0` |
| Flow type | `%s{flow_type}` | `%s{flow_type}` | — | `Direct`, `Loopback`, `VPN`, `VPN Tunnel`, `ZIA`, `ZPA` |
| Record ID | `%d{recordid}` | `%d{recordid}` | `%d{recordid}` | Unique per-log record identifier (NSS-only; not in Insights UI) |
| NSS escape done | `%s{eedone}` | `%s{eedone}` | `%s{eedone}` | Whether special characters were hex-encoded in the feed |

**Notes:**
- `%d{epochtime}` is the reliable timestamp for cross-feed joins. Wall-clock `%s{time}` excludes the timezone and requires pairing with `%s{tz}`.
- Client IP naming differs: web/DNS use `%s{cip}`; firewall uses `%s{csip}`. Same semantics.
- Firewall logs have additional client-side fields (`%s{tsip}` = tunnel source IP, `%s{cdfqdn}` = destination FQDN) that have no web/DNS equivalents.
- `%s{ztunnelversion}` is not present in DNS logs.

---

## Fields that join ZIA logs to ZPA (LSS) logs

ZIA and ZPA logs share no common session or transaction ID. Correlation is done on **user identity** and **time window**, not on a shared session key (Tier B — inferred from field inventory across both schemas).

| ZIA field | ZPA LSS field | Join semantics |
|---|---|---|
| `%s{login}` (web/fw/dns) | `Username` (User Activity) | User identity. ZIA uses email-format login; ZPA uses the username as entered in ZCC. Typically the same value if the IdP is shared. |
| `%s{devicehostname}` (web/fw) | `Hostname` (User Activity) | Device hostname. ZPA `Hostname` is only valid for ZCC and machine-tunnel clients. |
| `%s{deviceowner}` (web/fw) | — | ZIA only. No direct ZPA equivalent. |
| `%d{epochtime}` (web/fw/dns) | `LogTimestamp` (User Activity) | Timestamp. Use a ±30-second window for cross-feed correlation (event ordering may differ). |
| `%s{zpa_app_seg_name}` (web) | `ApplicationName` (User Activity) | When ZIA forwarding control routes a web request to ZPA via SIPA, the ZIA web log records the ZPA application segment name. This is the highest-fidelity ZIA→ZPA join field. |
| `%s{location}` (web/fw/dns) | `ServiceEdge` (User Activity) | Approximate co-location inference — not a direct join. |

**The `%s{zpa_app_seg_name}` field** on ZIA web logs is the most precise cross-product link. It appears when a ZIA forwarding control rule routes the request to a ZPA application segment (Source IP Anchoring). If this field is populated, the ZIA and ZPA logs can be correlated by matching `%s{zpa_app_seg_name}` (ZIA) to `ApplicationName` (ZPA LSS User Activity).

**ZCC as the correlation bridge**: `%s{devicehostname}` and `%s{deviceowner}` in ZIA logs, and `Hostname` and `Username` in ZPA LSS, are both populated from ZCC client metadata. On ZCC-forwarded traffic, these fields carry consistent values that function as device-level correlation keys across the two products.

### ZPA LSS key User Activity fields for correlation

From [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md):

| ZPA LSS field | Description |
|---|---|
| `Username` | User's login name (same source as ZIA `%s{login}` if shared IdP) |
| `Hostname` | Device hostname (same source as ZIA `%s{devicehostname}` for ZCC traffic) |
| `SessionID` | TLS session ID (ZPA-internal; no ZIA equivalent) |
| `ConnectionID` | Application connection ID |
| `ApplicationName` | ZPA application segment name (matches ZIA `%s{zpa_app_seg_name}` on SIPA traffic) |
| `LogTimestamp` | Log generation timestamp (join to ZIA `%d{epochtime}` with time-window tolerance) |
| `Platform` | Client OS (complements ZIA `%s{deviceostype}`) |
| `ClientPublicIP` | Public IP of ZCC (complements ZIA `%s{cpubip}`) |

---

## NSS field reference tables (key fields only)

For exhaustive field lists, see the per-schema reference docs. Below are the key fields by category for quick reference during SIEM query construction.

### ZIA web log — key fields

| Category | Key fields |
|---|---|
| Identity | `%s{login}`, `%s{dept}`, `%s{deviceowner}`, `%s{devicehostname}` |
| Policy outcome | `%s{action}`, `%s{rulelabel}`, `%s{ruletype}`, `%s{urlfilterrulelabel}`, `%s{apprulelabel}` |
| URL / destination | `%s{url}`, `%s{host}`, `%s{urlcat}`, `%s{appname}`, `%s{appclass}` |
| Network | `%s{cip}`, `%s{cpubip}`, `%s{sip}`, `%s{proto}`, `%s{trafficredirectmethod}` |
| SSL | `%s{ssldecrypted}`, `%s{externalspr}` |
| ZPA link | `%s{zpa_app_seg_name}`, `%s{fwd_type}` |
| Threat | `%s{threatname}`, `%s{malwarecat}`, `%d{riskscore}` |
| DLP | `%s{dlpdict}`, `%s{dlpeng}`, `%d{dlpidentifier}` |
| ZCC device | `%s{devicehostname}`, `%s{deviceostype}`, `%s{ztunnelversion}`, `%s{flow_type}` |
| Bytes | `%d{reqsize}`, `%d{respsize}`, `%d{totalsize}` |

### ZIA firewall log — key fields

| Category | Key fields |
|---|---|
| Identity | `%s{login}`, `%s{dept}`, `%s{deviceowner}`, `%s{devicehostname}` |
| Policy outcome | `%s{action}`, `%s{rulelabel}`, `%s{dnat}`, `%s{dnatrulelabel}` |
| Network (client) | `%s{csip}`, `%d{csport}`, `%s{cdip}`, `%d{cdport}`, `%s{cdfqdn}`, `%s{tsip}` |
| Network (server) | `%s{sdip}`, `%d{sdport}`, `%s{ssip}`, `%d{ssport}`, `%s{ipcat}` |
| Protocol | `%s{ipproto}`, `%s{nwapp}`, `%s{nwsvc}` |
| Session | `%d{duration}`, `%ld{inbytes}`, `%ld{outbytes}`, `%s{aggregate}`, `%d{numsessions}` |
| IPS | `%s{threatcat}`, `%s{threatname}`, `%d{threat_score}`, `%s{ipsrulelabel}` |
| Forwarding | `%s{rdr_rulename}`, `%s{fwd_gw_name}`, `%s{zpa_app_seg_name}` |
| Aggregation | `%s{aggregate}`, `%d{numsessions}`, `%d{avgduration}` |

**Firewall-specific aggregation**: the ZIA firewall module can aggregate multiple sessions into a single log record. The fields `%s{aggregate}`, `%d{numsessions}`, and `%d{avgduration}` indicate this. Per-session detail is lost when aggregation fires — client source port, server port, and IP values in aggregated records reflect the **last session** in the aggregate, not a summary.

### ZIA DNS log — key fields

| Category | Key fields |
|---|---|
| Identity | `%s{login}`, `%s{dept}`, `%s{deviceowner}`, `%s{devicehostname}` |
| Policy outcome | `%s{reqaction}`, `%s{reqrulelabel}`, `%s{resaction}`, `%s{resrulelabel}` |
| DNS query | `%s{req}` (FQDN), `%s{reqtype}` (A, AAAA, etc.), `%s{res}` (resolved IP), `%s{domcat}` |
| DNS response | `%s{res}`, `%s{restype}`, `%s{respipcat}`, `%s{error}` |
| DNS-specific | `%s{dnsapp}`, `%s{dnsappcat}`, `%d{istcp}`, `%s{protocol}` (TCP/UDP/DoH) |
| Network | `%s{cip}`, `%s{sip}`, `%d{sport}` |

---

## Practical correlation patterns

### Pattern 1: Correlating a ZIA web block with a ZPA access denial for the same user

**Scenario**: a user reports being unable to access a business application. ZIA blocks the initial web connection, and separately, ZPA denies a direct access attempt. Are these the same user? The same incident?

**Approach** (Tier B — synthesized from field inventory):

1. Query ZIA web logs for `%s{login} = <user>` AND `%s{action} = Blocked` in the incident time window.
2. Note the values of `%s{url}`, `%s{zpa_app_seg_name}` (if populated — indicates the destination is a ZPA segment), and `%d{epochtime}`.
3. If `%s{zpa_app_seg_name}` is populated, query ZPA LSS User Activity for `Username = <user>` AND `ApplicationName = <segment>` in the same ±30s window. Look for `ConnectionStatus = Close` with a non-zero `InternalReason`.
4. If `%s{zpa_app_seg_name}` is not populated, the ZIA block happened before the request reached ZPA. The ZPA denial (if it exists) is a separate connection, correlatable only by username and timestamp.

**SPL sketch**:
```
index=zia sourcetype=zia_web login="user@example.com" action=Blocked
| eval epochtime=epochtime
| join type=left username [
    search index=zpa sourcetype=zpa_useractivity Username="user@example.com" ConnectionStatus=Close
    | eval epochtime=floor(LogTimestamp)
    | rename ApplicationName as zpa_app_seg_name
  ]
| where abs(epochtime - zpa_epochtime) < 30
| table epochtime, url, zpa_app_seg_name, action, InternalReason
```

### Pattern 2: Correlating a ZIA DNS block with a subsequent web block

**Scenario**: a ZIA DNS policy blocks the resolution of a domain. A subsequent web request to the same hostname also blocks (Zscaler returns a synthetic DNS response and then blocks the web connection). Confirm both events are from the same user and the DNS block caused the web block.

**Approach**:

1. Query DNS logs for `%s{reqaction} = RES_BLOC` and `%s{req}` matching the domain in the time window.
2. Extract `%s{login}`, `%d{epochtime}` from the DNS event.
3. Query web logs for `%s{login}` = same user AND `%s{host}` matching the domain AND `%d{epochtime}` within +5 seconds of the DNS event.
4. Confirm `%s{action} = Blocked` and `%s{urlcat}` matches the DNS-blocked category.

The DNS block will typically precede the web block by 0–2 seconds (DNS is resolved before the HTTP CONNECT or GET).

### Pattern 3: Identifying ZCC bypass events

ZCC can bypass traffic when a user is on a trusted network or through explicit bypass configuration. Bypassed traffic still produces ZIA log entries but with `%d{bypassed_traffic} = 1` (web) or `%d{bypassed_session} = 1` (firewall).

```
index=zia sourcetype=zia_web bypassed_traffic=1
| stats count by login, devicehostname, location, url
| sort -count
```

A non-zero bypassed_traffic count for a user indicates ZCC is forwarding some connections outside of ZIA inspection. Cross-reference against the forwarding profile to confirm the bypass is intentional.

### Pattern 4: Identifying traffic source method

The `%s{trafficredirectmethod}` field in web logs identifies how traffic arrived at ZIA:

| Value | Meaning |
|---|---|
| `GRE` | GRE tunnel forwarding |
| `IPSEC` | IPsec tunnel forwarding |
| `PAC` | PAC file explicit proxy |
| `PAC_GRE` | PAC file over GRE tunnel |
| `PAC_IPSEC` | PAC file over IPsec tunnel |
| `Zscaler Client Connector` | ZCC forwarding |
| `DNAT` | Destination NAT transparent forwarding |
| `PBF` | Policy-based forwarding |

Filter by `trafficredirectmethod=GRE` to isolate site-based traffic. Filter by `Zscaler Client Connector` to isolate endpoint traffic. Combined with `%s{ztunnelversion}`, you can identify which ZCC users are on Z-Tunnel 1.0 vs 2.0.

### Pattern 5: End-to-end request tracing across ZIA + ZPA

For a request that ZIA routes to ZPA via Source IP Anchoring (SIPA):

1. ZIA web log carries `%s{fwd_type} = ZPA` and `%s{zpa_app_seg_name}` = the segment name.
2. ZPA LSS User Activity log carries `ApplicationName` = same segment name, `Username` = same user.
3. Join: `zpa_app_seg_name` (ZIA) = `ApplicationName` (ZPA) AND `login` (ZIA) = `Username` (ZPA) within ±30 seconds of `epochtime` / `LogTimestamp`.

This is the highest-confidence ZIA→ZPA join available without a shared session ID.

---

## Log streaming deployment architecture reference

### NSS deployment (ZIA)

NSS receives the Zscaler Nanolog stream and formats it as syslog or CEF for a SIEM. Two architectures:

- **Cloud NSS**: hosted by Zscaler; streams directly to the SIEM over the internet. No on-prem appliance. Current recommended approach.
- **Legacy NSS**: on-prem virtual appliance receives the stream. The NSS VM decapsulates and re-delivers to the SIEM on the local network.

Both architectures produce the same `%s{...}` / `%d{...}` field output.

Cloud Connector uses **NSS for Firewall only** (not NSS for Web) for its log streaming path. See [`../cloud-connector/logs/log-schema.md`](../cloud-connector/logs/log-schema.md).

### LSS deployment (ZPA)

LSS path: ZPA Zero Trust Exchange → Public Service Edge → App Connector → log receiver (SIEM).

Two components required in the customer environment:
- **Log receiver**: a syslog-capable host (Splunk HEC, syslog daemon, etc.) with a public-root-CA-signed certificate for mTLS.
- **App Connector**: already deployed for ZPA application access; also handles LSS forwarding.

LSS traffic uses mTLS between App Connector and the log receiver. The App Connector trusts public-root-CA-signed certs and any custom CA used as its enrollment CA.

---

## Open questions

- Exact ZIA NSS vs Cloud NSS field-level differences (if any) — [clarification `log-02`](../_meta/clarifications.md#log-02-cloud-nss-vs-legacy-nss-divergence)
- NSS feed format version behavior (whether format versions affect field availability) — [clarification `log-01`](../_meta/clarifications.md#log-01-nss-feed-format-versions)
- Timestamp timezone handling across feeds and regions — [clarification `log-03`](../_meta/clarifications.md#log-03-timestamp-timezone-handling)
- Whether ZPA LSS User Activity carries a field that directly maps to ZIA `%d{recordid}` (no evidence it does; cross-product record ID correlation is a gap)

## Cross-links

- SPL patterns catalog — [`./splunk-queries.md`](./splunk-queries.md)
- ZIA web log schema (all fields) — [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md)
- ZIA firewall log schema (all fields) — [`../zia/logs/firewall-log-schema.md`](../zia/logs/firewall-log-schema.md)
- ZIA DNS log schema (all fields) — [`../zia/logs/dns-log-schema.md`](../zia/logs/dns-log-schema.md)
- ZPA LSS User Activity schema (all fields) — [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md)
- ZCC operational log schema — [`../zcc/logs/zcc-log-schema.md`](../zcc/logs/zcc-log-schema.md)
- Cloud Connector log schema — [`../cloud-connector/logs/log-schema.md`](../cloud-connector/logs/log-schema.md)
- NSS architecture — [`./nss-architecture.md`](./nss-architecture.md)
- Source IP Anchoring (ZIA→ZPA forwarding context) — [`./source-ip-anchoring.md`](./source-ip-anchoring.md)
