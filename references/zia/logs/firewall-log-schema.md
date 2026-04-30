---
product: zia
topic: "zia-firewall-log-schema"
title: "ZIA firewall log schema (NSS Feed Output Format: Firewall Logs)"
content-type: reference
last-verified: "2026-04-23"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/nss-feed-output-format-firewall-logs"
  - "vendor/zscaler-help/nss-firewall-logs.csv"
author-status: draft
---

# ZIA firewall log schema (NSS Feed Output Format: Firewall Logs)

Authoritative field-level reference for ZIA firewall logs. Derived directly from Zscaler's published CSV (`vendor/zscaler-help/nss-firewall-logs.csv`, dated 2025-04-23).

Each field has two names: the NSS format specifier (`%s{...}` / `%d{...}`) used in raw NSS output, and the Insights Logs column name in the ZIA Firewall Insights UI. Fields marked "*NSS-only*" have no Insights equivalent per the CSV.

## Field inventory

### Date/Time

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{time}` | Time and date of the transaction. Excludes time zone. | `Mon Oct 16 22:55:48 2023` | Logged Time |
| `%s{tz}` | Time zone (as configured in the NSS feed) | `GMT` | *NSS-only* |
| `%02d{ss}` | Seconds (0–59) | `48` | derived from Logged Time |
| `%02d{mm}` | Minutes (0–59) | `55` | derived from Logged Time |
| `%02d{hh}` | Hours (0–23) | `22` | derived from Logged Time |
| `%02d{dd}` | Day of the month (1–31) | `16` | derived from Logged Time |
| `%02d{mth}` | Month of the year | `10` | derived from Logged Time |
| `%04d{yyyy}` | Year | `2023` | derived from Logged Time |
| `%s{mon}` | Name of the month | `Oct` | derived from Logged Time |
| `%s{day}` | Day of the week | `Mon` | derived from Logged Time |
| `%d{epochtime}` | Epoch time of the transaction | `1578128400` | *NSS-only* |

### Client Information

Many fields carry the caveat "For aggregated sessions, this is the … of the last session in the aggregate" (see the `%s{aggregate}` field).

| NSS specifier | Description (per CSV) | Example | Insights name |
|---|---|---|---|
| `%s{csip}` | Client source IP. For aggregated sessions, the last session's value. | `192.0.2.10`, `2001:db8::2:1` | Client Source IP |
| `%d{csport}` | Client source port. (Last-session value on aggregates.) | `22` | Client Source Port |
| `%s{cdip}` | Client destination IP. (Last-session value on aggregates.) | `198.51.100.54` | Client Destination IP |
| `%d{cdport}` | Client destination port. (Last-session value on aggregates.) | `22` | Client Destination Port |
| `%s{cdfqdn}` | Client destination FQDN (e.g., HTTP host header) | `www.example.com` | Client Destination Name |
| `%s{tsip}` | Client tunnel source IP. (Last-session value on aggregates.) | `192.0.2.15` | Client Tunnel IP |
| `%s{location}` | Location from which the session was initiated | `Headquarters` | Location |
| `%s{ttype}` | Traffic forwarding method used to send the traffic to the Firewall | `L2 tunnel` | Traffic Forwarding |
| `%s{aggregate}` | Whether the Firewall session is aggregated | `Yes` | Aggregated Session |
| `%s{srcip_country}` | Source country determined by client IP location. **No source-country value for aggregated sessions that are allowed.** | `United States` | Source Country |

### IPS

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{threatcat}` | Category of the threat detected by the IPS engine | `Botnet Callback`, `Denial of Service attack`, `Malicious Content` | Advanced Threat Category |
| `%s{threatname}` | Name of the detected threat | `Linux.Backdoor.Tsunami`, `Win32.Trojan.DNSpionage` | Threat Name |
| `%d{threat_score}` | Threat score (0–100, lowest to greatest). Assigned by Zscaler ThreatLabz. | `10` | Threat Score |
| `%s{threat_severity}` | Severity of the detected threat. Maps from `threat_score`. | `Critical (90–100)`, `High (75–89)`, `Medium (46–74)`, `Low (1–45)`, `None (0)` | Threat Severity |
| `%s{ipsrulelabel}` | Name of the IPS policy applied to the Firewall session | `Default IPS Rule` | IPS Rule Name |
| `%d{ips_custom_signature}` | `1` if a custom IPS signature rule was applied, `0` otherwise | `1`, `0` | IPS Custom Signature |

### Server Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{sdport}` | Server destination port. (Last-session value on aggregates.) | `443` | Server Destination Port |
| `%s{sdip}` | Server destination IP. (Last-session value on aggregates.) | `198.51.100.100` | Server Destination IP |
| `%s{ssip}` | Server source IP. (Last-session value on aggregates.) | `198.51.100.100` | Server Source IP |
| `%d{ssport}` | Server source port. (Last-session value on aggregates.) | `22` | Server Source Port |
| `%s{ipcat}` | URL category that corresponds to the server IP address | `Finance` | Server IP Category |

### Session Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{avgduration}` | Average session duration in ms, if sessions were aggregated | `600,000` | *NSS-only* |
| `%d{duration}` | Session or request duration in seconds | `600` | *NSS-only* |
| `%d{durationms}` | Session or request duration in ms | `600,000` | Session Duration |
| `%d{numsessions}` | Number of sessions aggregated | `5` | *NSS-only* |
| `%s{stateful}` | Whether the Firewall session is stateful | `Yes` | *NSS-only* |

### Transaction Action

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{rulelabel}` | Name of the rule applied to the transaction | `Default Firewall Filtering Rule` | Rule Name |
| `%s{action}` | Action taken on the transaction | `Allowed`, `Blocked` | Action |
| `%s{dnat}` | Whether the destination NAT policy was applied | `Yes` | *NSS-only* |
| `%s{dnatrulelabel}` | Name of the destination NAT policy applied | `DNAT_Rule_1` | DNAT Rule Name |

### Transaction Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{recordid}` | Record ID | (no example) | *NSS-only* |
| `%s{pcapid}` | PCAP file path. Format: `<Company ID>/<Directory>/<PCAP File Name>`. | `43139974/fw/663ba8fd30b50001.pcap` | Capture |
| `%ld{inbytes}` | Bytes from server to client | `10000` | Inbound Bytes |
| `%ld{outbytes}` | Bytes from client to server | `10000` | Outbound Bytes |
| `%s{nwapp}` | Network application accessed | `SSH` | Network Application |
| `%s{nwsvc}` | Network service used | `HTTP` | Network Service |
| `%s{ipproto}` | IP protocol type | `TCP` | Network Protocol |
| `%s{destcountry}` | Abbreviated country code of destination IP | `USA` | Dest Country |
| `%s{eedone}` | Whether Feed Escape Character field's characters were hex encoded | (no example) | *NSS-only* |

### User Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{login}` | User's login name in email address format | `jdoe@safemarch.com` | User |
| `%s{dept}` | Department of the user | `Sales` | Department |

### Zscaler Client Connector Device Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{devicehostname}` | Hostname of the device | `THINKPADSMITH` | Device Hostname |
| `%s{devicemodel}` | Model of the device | `20L8S7WC08` | Device Model |
| `%s{devicename}` | Name of the device | `admin` | Device Name |
| `%s{deviceostype}` | OS type of the device | `iOS`, `Android OS`, `Windows OS`, `MAC OS`, `Other OS` | OS Type |
| `%s{deviceosversion}` | OS version | `Version 10.14.2 (Build 18C54)` | OS Version |
| `%s{deviceowner}` | Owner of the device | `jsmith` | Device Owner |
| `%s{deviceappversion}` | App version the device uses | `2.0.0.120` | Enrolled Device appversion |
| `%s{external_deviceid}` | External device ID associating the user's device with MDM | `1234` | External Device ID |
| `%s{ztunnelversion}` | Z-Tunnel version | `ZTUNNEL_1_0` | Zscaler Client Connector Tunnel Version |
| `%d{bypassed_session}` | `1` if traffic bypassed Zscaler Client Connector, `0` otherwise | `1`, `0` | Bypassed Session |
| `%s{bypass_etime}` | Date and time when traffic bypassed Zscaler Client Connector | `Mon Oct 16 22:55:48 2023` | Bypassed Session Event Time |
| `%s{flow_type}` | Flow type of the transaction | `Direct`, `Loopback`, `VPN`, `VPN Tunnel`, `ZIA`, `ZPA` | Flow Type |

### Data Center

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{datacenter}` | Name of the data center | `CA Client Node DC` | Data Center |
| `%s{datacentercity}` | City where the data center is located | `Sa` | *NSS-only* |
| `%s{datacentercountry}` | Country where the data center is located | `US` | *NSS-only* |

### Forwarding Control

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{rdr_rulename}` | Name of the redirect/forwarding policy | `FWD_Rule_1` | Forwarding Rule |
| `%s{fwd_gw_name}` | Name of the gateway defined in a forwarding rule | `FWD_1` | Gateway Name |
| `%s{zpa_app_seg_name}` | Name of the ZPA application segment | `ZPA_test_app_segment` | Application Segment |

## Cross-links

- SPL patterns — [`../../shared/splunk-queries.md`](../../shared/splunk-queries.md)
- Decision criteria for when to consult logs — [`../../shared/log-correlation.md`](../../shared/log-correlation.md)
- ZIA web log schema (complementary data for mixed web/non-web investigations) — [`./web-log-schema.md`](./web-log-schema.md)

## Open questions

- NSS feed format versions — [clarification `log-01`](../../_meta/clarifications.md#log-01-nss-feed-format-versions)
- Cloud NSS vs legacy NSS divergence — [clarification `log-02`](../../_meta/clarifications.md#log-02-cloud-nss-vs-legacy-nss-divergence)
- Timestamp timezone handling across feeds / regions — [clarification `log-03`](../../_meta/clarifications.md#log-03-timestamp-timezone-handling)
