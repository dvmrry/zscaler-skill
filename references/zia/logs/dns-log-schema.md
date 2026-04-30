---
product: zia
topic: "zia-dns-log-schema"
title: "ZIA DNS log schema (NSS Feed Output Format: DNS Logs)"
content-type: reference
last-verified: "2026-04-23"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/nss-feed-output-format-dns-logs"
  - "vendor/zscaler-help/nss-dns-logs.csv"
author-status: draft
---

# ZIA DNS log schema (NSS Feed Output Format: DNS Logs)

Authoritative field-level reference for ZIA DNS logs. Derived directly from Zscaler's published CSV (`vendor/zscaler-help/nss-dns-logs.csv`, dated 2025-04-23).

Each field has two names: the NSS format specifier (`%s{...}` / `%d{...}`) used in raw NSS output, and the Insights Logs column name in the ZIA DNS Insights UI. Fields marked "*NSS-only*" have no Insights equivalent per the CSV.

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

### Transaction Action

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{reqrulelabel}` | Name of the rule applied to the DNS request | (no example) | Request Rule Name |
| `%s{reqaction}` | Name of the action applied to the DNS request | `REQ_ALLOW`, `RES_BLOC` | Request Action |
| `%s{resrulelabel}` | Name of the rule applied to the DNS response | (no example) | Response Rule Name |
| `%s{resaction}` | Name of the action applied to the DNS response | (no example) | Response Action |
| `%s{ecs_slot}` | Name of the EDNS Client Subnet (ECS) rule applied to the DNS transaction | `ECS Slot #17` | ECS Object Name |
| `%s{dnsgw_slot}` | Name of the DNS Gateway rule | `DNS GATEWAY Rule 1` | Resolver Gateway |

### Transaction Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{istcp}` | `1` if the DNS transaction uses TCP, `0` otherwise | `1`, `0` | *NSS-only* |
| `%s{cip}` | IP address of the user. Internal IP if visible (GRE tunnel, XFF header); else the NATed Public IP. | `203.0.113.5` | Client IP |
| `%d{durationms}` | DNS request duration in milliseconds | (no example) | Request Duration |
| `%s{sip}` | Server IP address of the request | `192.168.2.200` | Server IP |
| `%d{recordid}` | Unique record identifier for each log | (no example) | *NSS-only* |
| `%s{pcapid}` | PCAP file path. Format: `<Company ID>/<Directory>/<PCAP File Name>`. | `43139974/dns/663ba8fd30b50001.pcap` | Capture |
| `%s{location}` | Gateway location or sub-location of the source | `Headquarters` | Location |
| `%s{req}` | FQDN in the DNS request | `mail.safemarch.com` | Requested Domain |
| `%s{res}` | Resolved IP or NAME in the DNS response | `192.168.2.200`, `EMPTY_RESP` | Resolved IP or Name |
| `%s{domcat}` | Category of the content of the DNS request | `Professional Services` | Request Categories |
| `%s{respipcat}` | Category of the content of the DNS response | `Adult Themes` | Response Categories |
| `%s{reqtype}` | DNS request type | `A record` | DNS Request Type |
| `%s{restype}` | DNS response type (means or format) | `IPv4`, `IPv6` | DNS Response Type |
| `%d{sport}` | Server port of the request | (no example) | Server Port |
| `%s{eedone}` | Whether Feed Escape Character field's characters were hex encoded | `Yes` | *NSS-only* |
| `%s{error}` | DNS error code (usually incomplete or failed transaction) | `EMPTY_RESP` | DNS Error Code |
| `%s{ecs_prefix}` | EDNS Client Subnet (ECS) prefix used in the DNS request | `192.168.0.0` | ECS Prefix |
| `%s{dnsgw_srv_proto}` | DNS Gateway server protocol | `TCP`, `UDP`, `HTTP` | Server Protocol |
| `%s{dnsgw_flags}` | Flags indicating DNS Gateway status | `PRIMARY_SERVER_RESPONSE_PASS`, `SECONDARY_SERVER_RESPONSE_PASS`, `FO_DEST_PASS`, `FO_DEST_ERR`, `FO_DEST_DROP`, `None` | DNS Gateway Flags |
| `%s{http_code}` | HTTP return code used in DNS-over-HTTPS sessions | `100 - Continue` | HTTP Status Code |
| `%s{dnsappcat}` | DNS tunnel or network application category | `Commonly Blocked Tunnels` | DNS Tunnel & Network App Categories |
| `%s{dnsapp}` | Type of DNS tunnel or network application | `Google DNS` | DNS Tunnels & Network Apps |
| `%s{protocol}` | Protocol type | `TCP`, `UDP`, `DoH (DNS over HTTP)` | Protocol Type |

### User Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{login}` | Login name in email address format | `jdoe@safemarch.com` | User |
| `%s{dept}` | Department | `Sales` | Department |
| `%s{company}` | Company name | `Zscaler` | *NSS-only* |
| `%s{cloudname}` | Zscaler cloud name | `zscaler.net` | *NSS-only* |

### Zscaler Client Connector Device Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{devicehostname}` | Hostname of the device | `THINKPADSMITH` | Device Hostname |
| `%s{devicename}` | Name of the device | `admin` | Device Name |
| `%s{deviceowner}` | Owner of the device | `jsmith` | Device Owner |
| `%s{devicemodel}` | Model of the device | `VMware7,1` | Device Model |
| `%s{deviceosversion}` | OS version | `Microsoft Windows 10 Enterprise;64 bit` | Device OS Version |
| `%s{deviceostype}` | OS type | `Windows OS` | Device OS Type |
| `%s{deviceappversion}` | App version | `4.3.0.18` | Enrolled Device appversion |
| `%s{devicetype}` | Type of device | `Zscaler Client Connector`, `Cloud Browser Isolation`, `VDI`, `IOTG` | *NSS-only* |

### Data Center

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{datacenter}` | Name of the data center | `CA Client Node DC` | Data Center |
| `%s{datacentercity}` | City where the data center is located | `Sa` | *NSS-only* |
| `%s{datacentercountry}` | Country where the data center is located | `US` | *NSS-only* |

## Cross-links

- SPL patterns — [`../../shared/splunk-queries.md`](../../shared/splunk-queries.md)
- Decision criteria for when to consult logs — [`../../shared/log-correlation.md`](../../shared/log-correlation.md)
- ZIA web log schema (complementary data for "resolved but never connected" investigations) — [`./web-log-schema.md`](./web-log-schema.md)
- ZIA firewall log schema — [`./firewall-log-schema.md`](./firewall-log-schema.md)

## Open questions

- NSS feed format versions — [clarification `log-01`](../../_meta/clarifications.md#log-01-nss-feed-format-versions)
- Cloud NSS vs legacy NSS divergence — [clarification `log-02`](../../_meta/clarifications.md#log-02-cloud-nss-vs-legacy-nss-divergence)
- Timestamp timezone handling across feeds / regions — [clarification `log-03`](../../_meta/clarifications.md#log-03-timestamp-timezone-handling)
