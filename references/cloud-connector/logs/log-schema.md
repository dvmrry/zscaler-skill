---
product: cloud-connector
topic: "cc-log-schema"
title: "Cloud Connector log fields and access methods"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-about-insights.md"
  - "vendor/zscaler-help/cbc-accessing-cloud-branch-connector-monitoring.md"
  - "vendor/zscaler-help/cbc-analyzing-branch-connector-details.md"
  - "vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md"
  - "vendor/zscaler-help/about-log-streaming-service.md"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/ecgroup/ecgroup.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go"
author-status: draft
---

# Cloud Connector log fields and access methods

Cloud Connector (CC) and Branch Connector (BC) produce operational logs through two distinct paths: the **ZTW admin console Insights pages** (UI-only, no API access confirmed) and **NSS for Firewall streaming** (SIEM-accessible). There is no equivalent to ZIA's NSS for Web or ZPA's LSS for Cloud Connector — CC logs are scoped to session-level and tunnel-level data.

This document covers what log data Cloud Connector produces, the fields available in each surface, how to access logs programmatically, and the relationship between CC log data and ZIA-side logs.

For monitoring dashboard fields and API state objects (health status, upgrade state, ZIA gateway, ZPA broker), see [`../insights-monitoring.md`](../insights-monitoring.md). This document focuses specifically on **log record fields**, not operational state fields.

---

## Log surface overview

| Surface | Access method | Retention | Granularity |
|---|---|---|---|
| **Insights — Session Insights** | ZTW admin console (UI only) | Up to 92-day time picker window | Per-session |
| **Insights — DNS Insights** | ZTW admin console (UI only) | Up to 92-day time picker window | Per-DNS-transaction |
| **Insights — Tunnel Insights** | ZTW admin console (UI only) | Up to 92-day time picker window | Per-tunnel (byte/packet counts) |
| **NSS for Firewall** | SIEM (syslog / CEF via NSS appliance or Cloud NSS) | Configurable at SIEM | Per-session (firewall log format) |
| **ZIA-side logs** (ZIA-forwarded traffic only) | ZIA admin console, ZIA NSS | 14 days in ZIA; extended via NSS | Per-transaction (web/firewall format) |
| **SDK/API state** | Go SDK `ecgroup.GetAll()`, REST API | Point-in-time | Per-VM health state |

No raw log download API for Insights data was identified in available captures (Tier D — absence of evidence; see Open Questions in `../insights-monitoring.md`).

---

## NSS for Firewall — session log fields

Cloud Connector uses **NSS for Firewall** (not NSS for Web) as its SIEM streaming mechanism. NSS for Firewall must be subscribed separately. The NSS for Firewall field schema is the same schema used by ZIA's firewall log stream (Tier A — vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md).

CC session logs streamed via NSS for Firewall carry the standard ZIA firewall log fields. Key fields for CC context:

### Session identity and routing

| NSS specifier | Description | Example |
|---|---|---|
| `%s{login}` | User login name (if user identity is available; often empty for workload-to-workload traffic) | `jdoe@example.com` |
| `%s{location}` | CBC location object associated with the CC or BC group | `CC-AWS-US-East` |
| `%s{ttype}` | Traffic forwarding method used to send traffic to the firewall | `L2 tunnel` |
| `%s{rdr_rulename}` | Name of the forwarding rule that determined disposition | `FWD_Rule_1` |
| `%s{fwd_gw_name}` | Name of the gateway in the forwarding rule | `FWD_1` |
| `%s{zpa_app_seg_name}` | ZPA application segment name (when forwarding method is ZPA) | `ZPA_test_app_segment` |
| `%s{action}` | Action taken: `Allowed` or `Blocked` | `Allowed` |
| `%s{rulelabel}` | Name of the rule applied to the transaction | `Default Firewall Filtering Rule` |

### Network (client/source — the workload)

| NSS specifier | Description | Example |
|---|---|---|
| `%s{csip}` | Client (workload) source IP | `10.0.1.50` |
| `%d{csport}` | Client source port | `54321` |
| `%s{cdip}` | Client destination IP | `203.0.113.10` |
| `%d{cdport}` | Client destination port | `443` |
| `%s{cdfqdn}` | Client destination FQDN (from HTTP host header if present) | `api.example.com` |
| `%s{tsip}` | Client tunnel IP (tunnel source IP at CC) | `172.16.0.5` |
| `%s{srcip_country}` | Source country based on client IP | `United States` |

### Network (server/destination)

| NSS specifier | Description | Example |
|---|---|---|
| `%s{sdip}` | Server destination IP | `203.0.113.10` |
| `%d{sdport}` | Server destination port | `443` |
| `%s{ssip}` | Server source IP (return path) | `203.0.113.10` |
| `%d{ssport}` | Server source port | `443` |
| `%s{ipcat}` | URL category corresponding to the server IP | `Finance` |
| `%s{destcountry}` | Abbreviated country code of destination IP | `USA` |

### Session metrics

| NSS specifier | Description | Example |
|---|---|---|
| `%d{duration}` | Session duration in seconds | `600` |
| `%d{durationms}` | Session duration in milliseconds | `600000` |
| `%ld{inbytes}` | Bytes from server to client (inbound to workload) | `10000` |
| `%ld{outbytes}` | Bytes from client to server (outbound from workload) | `2000` |
| `%s{ipproto}` | IP protocol type | `TCP` |
| `%s{nwapp}` | Network application identified | `SSH` |
| `%s{nwsvc}` | Network service used | `HTTPS` |
| `%s{aggregate}` | Whether the session is aggregated | `Yes` |
| `%d{numsessions}` | Number of sessions in an aggregate | `5` |
| `%d{avgduration}` | Average session duration in milliseconds (aggregated) | `600000` |

### IPS fields (when IPS is enabled)

| NSS specifier | Description | Example |
|---|---|---|
| `%s{threatcat}` | Threat category detected by IPS engine | `Botnet Callback` |
| `%s{threatname}` | Threat name | `Linux.Backdoor.Tsunami` |
| `%d{threat_score}` | Threat score (0–100) | `85` |
| `%s{threat_severity}` | Threat severity: `Critical (90–100)`, `High (75–89)`, `Medium (46–74)`, `Low (1–45)`, `None (0)` | `High (75–89)` |
| `%s{ipsrulelabel}` | IPS policy name applied | `Default IPS Rule` |

### Timestamp fields

| NSS specifier | Description | Notes |
|---|---|---|
| `%s{time}` | Wall-clock time (no timezone) | Pair with `%s{tz}` |
| `%s{tz}` | Timezone as configured in the NSS feed | |
| `%d{epochtime}` | Epoch time (seconds since Unix epoch) | Use for joins with ZIA/ZPA logs |
| `%s{datacenter}` | Name of the ZIA data center processing the session | |

For the full NSS firewall log schema (all fields), see [`../../zia/logs/firewall-log-schema.md`](../../zia/logs/firewall-log-schema.md). The CC session logs use the same field set.

---

## Insights pages — UI log fields

The ZTW admin console Insights pages expose session, DNS, and tunnel data. These are accessible only through the UI (no API path confirmed). Multi-day views aggregate per day; for intraday granularity, use a single-day time range.

### Session Insights log tab fields (partial)

The Logs tab drilldown from Session Insights shows per-session records. The exact column set is Tier B (not fully enumerated in available captures). Known dimensions:

| Dimension | Description |
|---|---|
| Source | Workload source (IP or tag-based identifier) |
| Destination IP / FQDN | Destination of the session |
| Forwarding method | ZIA / ZPA / Direct / Drop |
| Session byte count | Inbound + outbound bytes |
| Location | CBC location associated with the CC group |
| Time | Session timestamp |

### DNS Insights log tab fields

DNS Insights covers DNS queries traversing Cloud Connector. Unit is transactions (query/response pairs). Fields visible in the Logs tab (Tier B — partially confirmed):

| Field | Description |
|---|---|
| Requested Domain | FQDN of the DNS query |
| Request Type | DNS record type (A, AAAA, MX, etc.) |
| Response | Resolved IP or name |
| Action | Allow / Block |
| Location | CBC location |
| Time | Query timestamp |

### Tunnel Insights metrics

Tunnel Insights shows ZIA and ZPA tunnel state from Cloud Connector. Metrics are per-CC or per-group depending on filter state. No raw log tab — metrics only:

| Metric | Description |
|---|---|
| DPD Received | Dead Peer Detection keepalive packets received — proxy for tunnel liveness |
| Received Bytes | Bytes received by CC from the ZIA/ZPA tunnel |
| Received Packets | Packet count for Received Bytes |
| Sent Bytes | Bytes sent by CC to the ZIA/ZPA tunnel (workload traffic forwarded to Zscaler) |
| Sent Packets | Packet count for Sent Bytes |

Zero `Sent Bytes` on an Active CC is the primary indicator of a forwarding rule or ZIA gateway misconfiguration.

---

## SDK/API state fields (per-VM monitoring)

The Go SDK `ECVMs` struct (from `zscaler/ztw/services/common/common.go`) exposes per-VM state programmatically. These are **state fields**, not log records, but they are the only programmatic observability surface for Cloud Connector health (Tier A — vendor/zscaler-sdk-go/zscaler/ztw/services/ecgroup/ecgroup.go):

| Field | Type | Description |
|---|---|---|
| `OperationalStatus` | string | `Active`, `Inactive`, or `Disabled` |
| `ZiaGateway` | string | Active ZIA gateway name |
| `ZpaBroker` | string | Active ZPA broker |
| `BuildVersion` | string | Current CC software version (e.g., `24.x.x`) |
| `NatIp` | string | NAT IP of the CC (public egress IP seen by Zscaler) |
| `LastUpgradeTime` | int (epoch) | Unix timestamp of last software upgrade |
| `UpgradeStatus` | int | Current upgrade state (0 = current; non-zero = in-progress or failed; exact codes undocumented) |
| `UpgradeStartTime` | int (epoch) | Start time of most recent upgrade |
| `UpgradeEndTime` | int (epoch) | End time of most recent upgrade |
| `Status` | []string | Per-VM status flags |

```go
// Pull all groups with per-VM state
groups, err := ecgroup.GetAll(ctx, service)
for _, group := range groups {
    for _, vm := range group.ECVMs {
        fmt.Printf("VM: %s, Status: %s, ZIA: %s, Build: %s\n",
            vm.Name, vm.OperationalStatus, vm.ZiaGateway, vm.BuildVersion)
    }
}
```

---

## Accessing CC logs in practice

### Path 1: NSS for Firewall → SIEM (recommended for SIEM integration)

1. Subscribe to NSS for Firewall (separate entitlement).
2. Deploy NSS virtual appliance on Azure, AWS, or vSphere (or use Cloud NSS if available for your cloud).
3. Configure a log receiver in the ZTW admin console pointing to the NSS VA.
4. Configure the NSS VA to forward to your SIEM (Splunk, Sentinel, etc.).

CC session logs arrive in the SIEM in the ZIA firewall log format. Use `%s{location}` to filter to CC-specific locations and distinguish CC traffic from branch/on-prem ZIA traffic.

### Path 2: ZIA admin console (ZIA-forwarded traffic only)

Traffic that CC forwards via the ZIA forwarding method appears in ZIA's own log surfaces (ZIA Web Insights, ZIA Firewall Insights, ZIA API). Filter by the CC location in the ZIA console. This path covers only ZIA-forwarded traffic — Direct-forwarded and ZPA-forwarded traffic does not appear in ZIA logs.

Cross-referencing tip: CC VMs behind cloud-provider NAT show their **NAT IP** in ZIA tunnel logs, but the SDK/console shows the **private management IP**. Use the CC group and location as the correlation key — not the IP address.

### Path 3: ZTW admin console Insights pages (UI, no SIEM export)

For ad-hoc investigation, the Insights pages (Session, DNS, Tunnel) are the fastest path. They support time range selection up to 92 days, chart-to-log drilldown, and multi-value filtering. No programmatic access path is confirmed for Insights data.

### Path 4: Cloud-provider native monitoring (load balancer health)

Cloud Connector registers health with the cloud-native load balancer via HTTP health probes on the `?cchealth` path. The load balancer's own access logs capture the probe history. AWS CloudWatch and Azure Monitor surface these as load balancer health events — the most reliable path for "CC went unhealthy" alerting.

| Cloud | Default probe interval | Healthy response | Unhealthy signal |
|---|---|---|---|
| AWS Gateway Load Balancer | 30 seconds | HTTP 200 on `?cchealth` | HTTP 503 or no response |
| Azure Load Balancer | 15 seconds | HTTP 200 on `?cchealth` | HTTP 503 or no response |

`Status: Active` in the ZTW console reflects enrollment state (control channel), not load-balancer health (data plane). These can diverge during partial outages. Always check cloud-native LB health when diagnosing traffic loss.

---

## Correlation with ZIA and ZPA logs

CC traffic that passes through ZIA (ZIA forwarding method) generates ZIA NSS records. The correlation join is:

- ZIA side: `%s{location}` = the CC location name; `%s{trafficredirectmethod}` = forwarding method.
- CC side: `%s{location}` in NSS firewall logs = same location name.
- Cross-product timestamp join: `%d{epochtime}` (ZIA firewall) with ±30s tolerance.

CC traffic forwarded via ZPA generates ZPA LSS User Activity records. The join is weaker — use `%s{location}` (ZIA) against ZPA session context, and username if workload identity is available.

For Direct-forwarded traffic: no ZIA or ZPA log records exist. NSS for Firewall is the only centralized log path.

See [`../../shared/log-correlation.md`](../../shared/log-correlation.md) for broader cross-product correlation patterns.

---

## Operational gotchas

### NSS for Firewall is the only SIEM-streaming path

ZIA NSS for Web does not apply to Cloud Connector. If you configure NSS for Web only and expect CC session logs, they will not appear. Subscribe to and configure NSS for Firewall specifically.

### Direct-forwarded traffic has no ZIA log entry

Traffic with `%s{fwd_type} = Direct` (or equivalent CC forwarding rule = Direct) bypasses Zscaler entirely. CC session logs for this traffic exist in the NSS for Firewall stream only. ZIA Web Insights will show gaps for Direct-forwarded workload traffic — this is expected, not a misconfiguration.

### Log and Control Forwarding outage stops log accumulation silently

If the Log & Control Forwarding gateway becomes unreachable, CC continues forwarding data-plane traffic but stops shipping session logs to Zscaler. Insights data stops accumulating while the CC remains `Active` in the console. A CC with zero Insights data for an extended period despite Active status is the primary symptom. Verify the Log and Control Gateway network path independently of the data-plane path.

### Aggregated sessions lose per-connection detail

The NSS firewall log aggregation behavior applies to CC session logs. When sessions are aggregated (`%s{aggregate} = Yes`), client source port, server port, and IP values reflect only the **last session** in the aggregate. Per-session detail is lost. For investigations requiring per-connection granularity, use shorter time windows to reduce aggregation.

---

## Cross-links

- Cloud Connector monitoring dashboard and Insights surfaces — [`../insights-monitoring.md`](../insights-monitoring.md)
- Cloud Connector overview and architecture — [`../overview.md`](../overview.md)
- ZIA firewall log schema (full NSS field set, same format as CC session logs) — [`../../zia/logs/firewall-log-schema.md`](../../zia/logs/firewall-log-schema.md)
- Cross-product log correlation (join keys between CC, ZIA, and ZPA logs) — [`../../shared/log-correlation.md`](../../shared/log-correlation.md)
- Log & Control Forwarding (telemetry channel) — [`../dns-subsystem.md`](../dns-subsystem.md)
- NSS architecture — [`../../shared/nss-architecture.md`](../../shared/nss-architecture.md)
