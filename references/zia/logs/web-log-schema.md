---
product: zia
topic: "zia-web-log-schema"
title: "ZIA web log schema (NSS Feed Output Format: Web Logs)"
content-type: reference
last-verified: "2026-04-23"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/nss-feed-output-format-web-logs"
  - "vendor/zscaler-help/nss-web-logs.csv"
author-status: draft
---

# ZIA web log schema (NSS Feed Output Format: Web Logs)

Authoritative field-level reference for ZIA web access logs. Derived directly from Zscaler's published CSV (`vendor/zscaler-help/nss-web-logs.csv`, dated 2025-05-07) — field names, descriptions, and example values are quoted or paraphrased from that CSV.

## Contents

- [What a record is](#what-a-record-is) — NSS specifier vs Insights column name
- [Field inventory](#field-inventory) — Date/Time · User · Policy · URL Categorization · Cloud Application · HTTP Transaction · Network · SSL · Client Connection · Server Connection · Threat Protection · DLP · File Type Control · Sandbox · Bandwidth Control · Forwarding Control · Mobile Application · Data Center · Device Information · Miscellaneous
- [Fields that require additional enablement](#fields-that-require-additional-enablement)
- [Cross-links](#cross-links) · [Open questions](#open-questions)

## What a record is

One record = one HTTP or HTTPS transaction observed by a ZIA Public Service Edge. Each field has two possible names depending on how the data is consumed:

- **NSS format specifier** — the `%s{...}` / `%d{...}` token used when configuring an NSS feed (e.g., `%s{url}`, `%d{respsize}`). This is what appears in raw NSS output sent to a SIEM.
- **Insights Logs column name** — the human-readable column name in the ZIA Web Insights UI. Many fields have both; some are specific to NSS and have no Insights equivalent.

Both are given in the tables below. Fields marked "*NSS-only*" in the rightmost column do not appear in the Insights UI.

## Field inventory

### Date/Time

| NSS specifier | Type | Description (per CSV) | Example | Insights name |
|---|---|---|---|---|
| `%s{time}` | string | The time and date of the transaction. Excludes the time zone. | `Mon Oct 16 22:55:48 2023` | Logged Time |
| `%s{tz}` | string | The time zone. Same as the time zone specified when configuring the NSS feed. | `GMT` | *NSS-only* |
| `%02d{ss}` | int | Seconds (0–59) | `48` | derived from Logged Time |
| `%02d{mm}` | int | Minutes (0–59) | `55` | derived from Logged Time |
| `%02d{hh}` | int | Hours (0–23) | `22` | derived from Logged Time |
| `%02d{dd}` | int | Day of the month (1–31) | `16` | derived from Logged Time |
| `%02d{mth}` | int | Month of the year | `10` | derived from Logged Time |
| `%04d{yyyy}` | int | Year | `2023` | derived from Logged Time |
| `%s{mon}` | string | Name of the month | `Oct` | derived from Logged Time |
| `%s{day}` | string | Day of the week | `Mon` | derived from Logged Time |
| `%d{epochtime}` | int | Epoch time of the transaction | `1578128400` | *NSS-only* |

### User Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{login}` | User's login name in email address format | `jdoe@safemarch.com` | User |
| `%s{dept}` | Department of the user | `Sales` | Department |
| `%s{company}` | Name of the company | `Zscaler` | *NSS-only* |
| `%s{cloudname}` | Name of the Zscaler cloud | `zscaler.net` | *NSS-only* |

### Policy (action and rule names)

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{action}` | Action taken on the transaction | `Allowed`, `Blocked` | Policy Action |
| `%s{ruletype}` | Type of policy. Applies only to Block rules, not Allow. | `File Type Control`, `Data Loss Prevention`, `Sandbox` | Blocked Policy Type |
| `%s{rulelabel}` | Name of the rule applied. **Applies only to Block rules, not Allow.** | `URL_Filtering_1` | Blocked Policy Name |
| `%s{reason}` | The action taken and the policy applied, if the transaction was blocked | `Virus/Spyware/Malware Blocked`, `Not allowed to browse this category`, `This page is unsafe (high PageRisk index)` | (no Insights name in CSV) |
| `%s{urlfilterrulelabel}` | Name of the rule applied to the URL filter | `URL_Filtering_1` | URL Filtering Policy Name |
| `%s{apprulelabel}` | Name of the rule applied to the application (Cloud App Control) | `File_Sharing_1` | Cloud Application Policy Name |

Two things to note: (1) `rulelabel` and `ruletype` are Block-only — an Allow rule firing produces no `rulelabel` value. (2) Separate fields exist for URL Filtering rule (`urlfilterrulelabel`) vs Cloud App Control rule (`apprulelabel`), so both can be present in a single record if both layers evaluated.

### URL Categorization

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{urlclass}` | Class of the destination URL | `Bandwidth Loss`, `General Surfing`, `Privacy Risk` | URL Class |
| `%s{urlsupercat}` | Super category of the destination URL | `Entertainment/Recreation`, `Travel`, `Security` | URL Super Category |
| `%s{urlcat}` | Category of the destination URL. Also includes Advanced Threat Category values. | `Entertainment`, `Adult Themes`, `Games`, `Spyware Callback` | URL Category |
| `%s{urlcatmethod}` | Source of the URL's category | `Database A`, `Database B`, `AI/ML-based content categorization`, `User-Defined`, `None` | URL Categorization Method |

### Cloud Application

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{appname}` | Name of the cloud application | `Adobe Connect`, `Craigslist`, `Dropbox` | Cloud Application |
| `%s{appclass}` | Cloud application category | `Administration`, `Collaboration`, `Web Mail` | Cloud Application Class |
| `%s{app_risk_score}` | Computed or assigned risk index for the cloud application (1 = lowest, 5 = highest; `None` if unavailable) | `1–5`, `None` | Risk Index |
| `%s{app_status}` | Status of the cloud application | `Sanctioned`, `Unsanctioned`, `N/A` | Application Status |
| `%s{activity}` | Name of the action the user performed on the application | `Download` | Application Activity |
| `%s{prompt_req}` | The prompt entered by the user in the generative AI application | (no example) | Prompt |
| `%s{inst_level1_type}` | Level 1 type (e.g., Organization for Google Cloud Platform) | `ORG` | App Instance Level 1 Type |
| `%s{inst_level1_id}` | Level 1 ID for the discovered cloud application instance | `12324321232` | App Instance Level 1 |
| `%s{inst_level1_name}` | Additional information on the level 1 instance | `org_12324321232` | *NSS-only* |
| `%s{inst_level2_type}` | Level 2 type (e.g., Project for GCP) | `PROJECT` | App Instance Level 2 Type |
| `%s{inst_level2_id}` | Level 2 ID for the instance | `project_max1` | App Instance Level 2 |
| `%s{inst_level2_name}` | Additional level 2 information | `genai_pr` | *NSS-only* |
| `%s{inst_level3_type}` | Level 3 type (e.g., Resource Type for GCP) | `RESOURCE_TYPE` | App Instance Level 3 Type |
| `%s{inst_level3_id}` | Level 3 ID for the instance | `Vertex AI` | App Instance Level 3 |
| `%s{inst_level3_name}` | Additional level 3 information | `None` | *NSS-only* |

### HTTP Transaction

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{reqdatasize}` | HTTP request payload size (excluding headers), bytes | `1000` | *NSS-only* |
| `%d{reqhdrsize}` | HTTP request header size, bytes | `300` | *NSS-only* |
| `%d{reqsize}` | Request size in bytes (headers + payload) | `1300` | Sent Bytes |
| `%d{respdatasize}` | HTTP response payload size (excluding headers), bytes | `10000` | *NSS-only* |
| `%d{resphdrsize}` | HTTP response header size, bytes | `500` | *NSS-only* |
| `%d{respsize}` | Total HTTP response size (headers + payload), bytes | `10500` | Received Bytes |
| `%d{totalsize}` | Total HTTP transaction size | `11800` | Total Bytes |
| `%s{reqmethod}` | HTTP request method | `invalid`, `get`, `connect` | Request Method |
| `%s{reqversion}` | HTTP request version | `1.1` | Request HTTP Version |
| `%s{respcode}` | HTTP response code sent to the client. The service generates a 403-Forbidden response for blocked transactions. | `100`, `202`, `305`, `403`, `500` | Response Code |
| `%s{respversion}` | HTTP response version | `1` | Response HTTP Version |
| `%s{referer}` | HTTP referrer URL | `www.google.com` | Referrer URL |
| `%s{refererhost}` | Hostname of the referrer URL | `www.example.com` | *NSS-only* |
| `%s{uaclass}` | User agent class | `Firefox`, `Chrome`, `Safari` | *NSS-only* |
| `%s{ua}` | Full user agent string | `Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0)` | User Agent |
| `%s{ua_token}` | User agent token (`None` if unavailable) | `Google Chrome (0.x)`, `Mozilla (5.0)` | *NSS-only* |
| `%s{host}` | Destination hostname. Host value from HTTP request line if present; falls back to Host header. | `mail.google.com` | *NSS-only* |
| `%s{url}` | Destination URL. Excludes the protocol identifier (`http://` or `https://`). | `www.trythisencodeurl.com/index` | URL |
| `%s{df_hostname}` | TLS connection's SNI when the HTTPS request host header does not match the SNI. **Requires TLS Inspection enabled.** Populated only on mismatch. | (no example) | Domain Fronted SNI |
| `%s{df_hosthead}` | Host header value for HTTP/S transactions indicating domain fronting (FQDN mismatch between request URL and host header). Populated only on mismatch. | (no example) | Domain Fronted Host Header |
| `%s{contenttype}` | Content type name | `application/vnd_apple_keynote`, `image/gif`, `text/x_python` | Content Type |

### Network

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{cip}` | IP address of the user. Internal IP if visible (e.g., GRE tunnel, XFF header); else same as `%s{cintip}`. | `192.168.2.200`, `2001:db8::2:1` | Client IP |
| `%s{cintip}` | Client's internet (NATed Public) IP. Differs from `%s{cip}` if internal IP is visible; else same. | `203.0.113.5` | *NSS-only* |
| `%s{cpubip}` | Client public IP address | `198.51.100.100` | Client External IP |
| `%d{clt_sport}` | Client source port. **Requires contacting Zscaler Support to enable logging.** | `12345` | Client Source Port |
| `%s{srcip_country}` | Country associated with the source IP | `Afghanistan` | Source IP Country |
| `%s{dstip_country}` | Country associated with the destination IP | `Portugal` | Destination IP Country |
| `%s{is_src_cntry_risky}` | Whether the source-IP country is considered risky | `Yes` | *NSS-only* |
| `%s{is_dst_cntry_risky}` | Whether the destination-IP country is considered risky | `No` | *NSS-only* |
| `%s{sip}` | Destination server IP. **Displays `0.0.0.0` if the request was blocked.** | `1.1.1.1`, `2001:db8::2:1` | Server IP |
| `%d{srv_dport}` | Server destination port. **Requires Zscaler Support to enable logging.** | `443` | Server Destination Port |
| `%s{proto}` | Protocol type of the transaction | `HTTP`, `FTP` | Protocol |
| `%s{alpnprotocol}` | Application-Layer Protocol Negotiation (ALPN) protocol | `FTP`, `SMB` | ALPN Protocol |
| `%s{trafficredirectmethod}` | Traffic forwarding method to ZIA Public Service Edges | `DNAT`, `GRE`, `IPSEC`, `PBF`, `PAC`, `PAC_GRE`, `PAC_IPSEC`, `Zscaler Client Connector` | Traffic Forwarding |
| `%s{location}` | Gateway location or sub-location of the source | `Headquarters` | Location |
| `%s{userlocationname}` | Actual traffic origination point when traffic is processed via Isolation. `None` for non-Isolation traffic. | (no example) | User Location |

### SSL

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{ssldecrypted}` | Whether the transaction was SSL inspected | `Yes`, `No` | SSL Inspected |
| `%s{externalspr}` | SSL policy reasons | `Blocked`, `Inspected`, `N/A`, `Not inspected because of O365 bypass`, `Not inspected because of SSL policy`, `Not inspected because of UCaaS bypass`, `Not inspected because of Zscaler best practices` | SSL Policy Reason |
| `%s{keyprotectiontype}` | Whether HSM or Software Protection intermediate CA certificate is used for TLS interception | `HSM Protection`, `Software Protection`, `N/A` | Intermediate CA Protection Type |

### Client Connection

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{clientsslcipher}` | Negotiated cipher suite (client ↔ Zscaler) | `SSL3_CK_RSA_NULL_MD5` | Client Connection Cipher |
| `%s{clienttlsversion}` | TLS version (client ↔ Zscaler) | `SSL2`, `SSL3`, `TLS1_1`, `TLS1_2`, `TLS1_3` | Client Connection TLS Version |
| `%s{clientsslsessreuse}` | Whether client cipher session was reused | `Unknown`, `No`, `Yes` | Client Session Reused |
| `%s{cltsslfailreason}` | Reason for client SSL handshake failure | `Bad Record Mac`, `Certificate Unknown`, `Close Notify` | Client SSL Handshake Failure Reason |
| `%d{cltsslfailcount}` | Number of failed client SSL handshake attempts | (no example) | Client SSL Handshake Failure Aggregate Count |

### Server Connection

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{srvsslcipher}` | Negotiated cipher suite (Zscaler ↔ server) | `SSL3_CK_RSA_NULL_MD5` | Server Connection Cipher |
| `%s{srvtlsversion}` | TLS/SSL version (Zscaler ↔ server) | `TLS1_2` | Server Connection TLS Version |
| `%s{serversslsessreuse}` | Whether server cipher session was reused | `Unknown`, `No`, `Yes` | Server Session Reused |
| `%s{srvocspresult}` | OCSP result / certificate revocation result | `Good`, `Revoked`, `Unknown` | Server Connection OCSP Result |
| `%s{srvcertchainvalpass}` | Validation of the certificate chain | `Unknown`, `Fail`, `Pass` | Server Connection Cert Chain Validity |
| `%s{srvwildcardcert}` | Whether server presented a wildcard certificate | `Unknown`, `No`, `Yes` | Server Wildcard Certificate |
| `%s{srvcertvalidationtype}` | Server certificate validation method | `EV`, `OV`, `DV` | Server Certificate Validation Type |
| `%s{srvcertvalidityperiod}` | Server certificate expiration bucket | `Short (0–3 months)`, `Medium (3–12 months)`, `Long (More than 12 months)` | Server Certificate Validity Period |
| `%s{is_ssluntrustedca}` | Whether server cert is signed by a Zscaler-trusted CA | `Fail`, `Pass`, `None` | Certificate Chain Validity |
| `%s{is_sslselfsigned}` | Whether server presented a self-signed certificate | `Yes`, `No`, `None` | Server Certificate Self Signed |
| `%s{is_sslexpiredca}` | Whether server certificate is expired | `Yes`, `No`, `None` | Server Connection Cert Expiry |

### Threat Protection

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{riskscore}` | Page Risk Index score of the destination URL. Range 0–100. | `10` | Suspicious Content |
| `%s{threatseverity}` | Severity of the detected threat. Maps from `riskscore`. | `Critical (90–100)`, `High (75–89)`, `Medium (46–74)`, `Low (1–45)`, `None (0)` | Threat Severity |
| `%s{threatname}` | Name of the detected threat | `EICAR Test File` | Threat Name |
| `%s{malwarecat}` | Malware category detected, or Sandbox analysis result | `Adware`, `Benign`, `Trojan`, `Sandbox Adware`, `Sandbox Malware` | Threat Category |
| `%s{malwareclass}` | Class of detected malware | `Sandbox` | Threat Super Category |

### DLP

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{dlpdict}` | DLP dictionaries matched | `Credit Cards\|Gambling\|MRN Numbers` | DLP Dictionaries |
| `%s{dlpdicthitcount}` | Hit counts for each matched dictionary | `4\|5\|1\|2` | *NSS-only* |
| `%s{dlpeng}` | DLP engine matched | `HIPAA` | DLP Engine |
| `%d{dlpidentifier}` | Unique DLP incident identifier | `6646484838839025669` | DLP Identifier |
| `%s{dlpmd5}` | MD5 hash of the transaction | `154f149b1443fbfa8c121d13e5c019a1` | DLP MD5 |
| `%s{dlprulename}` | Name of DLP rule applied. **Applies only to Allow rules, not Block. Requires Zscaler Support to enable logging.** | `DLP_Rule_1` | Allowed DLP Rule Name |
| `%s{trig_dlprulename}` | Name of DLP rule that triggered the transaction (Allow or Block) | `DLP_Rule_1` | *NSS-only* |
| `%s{other_dlprulenames}` | Names of DLP rules evaluated and passed without action | `[DLP_Rule_4, DLP_Rule_5]` | Other DLP Rules |
| `%s{all_dlprulenames}` | All DLP rule names (triggered + passed). Combination of the above two. | `[DLP_Rule_1, DLP_Rule_4, DLP_Rule_5]` | *NSS-only* |

### File Type Control

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{fileclass}` | Class of downloaded file | `Active Web Contents`, `Archive Files`, `Audio` | *NSS-only* |
| `%s{filetype}` | Type of downloaded file | `RAR Files`, `ZIP`, `Windows Executables` | Download File Type |
| `%s{filename}` | Name of downloaded file | `nssfeed.txt` | Download File Name |
| `%s{filesubtype}` | Subtype of the downloaded file (extension) | `rar`, `exe`, `ppt` | *NSS-only* |
| `%s{upload_fileclass}` | Class of uploaded file | `Active Web Contents` | *NSS-only* |
| `%s{upload_filetype}` | Type of uploaded file | `RAR Files` | Upload File Type |
| `%s{upload_filename}` | Name of uploaded file | `nssfeed.exe` | Upload File Name |
| `%s{upload_filesubtype}` | Subtype of the uploaded file | `rar`, `exe` | *NSS-only* |
| `%s{upload_doctypename}` | Type of document uploaded or downloaded | `Corporate Finance`, `Court Form`, `DMV`, `Insurance`, `Legal` | Document Type |
| `%s{unscannabletype}` | Unscannable file type classification | `Encrypted File`, `Undetectable File`, `Unscannable File` | Unscannable Type |

### Sandbox

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{bamd5}` | MD5 hash of the malware file, or the MD5 of the file sent for Sandbox analysis | `196a3d797bfee07fe4596b69f4ce1141` | MD5 |
| `%s{sha256}` | SHA-256 hash of identical files | `81ec78bc8298568bb5ea66d3c2972b670d0f7459b6cdbbcaacce90ab417ab15c` | SHA-256 |

### Bandwidth Control

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{throttlereqsize}` | Throttled transaction size in Uplink (Upload) direction, bytes | `5` | Throttled request bytes |
| `%d{throttlerespsize}` | Throttled transaction size in Downlink (Download) direction, bytes | `7` | Throttled response bytes |
| `%s{bwthrottle}` | Whether the transaction was throttled by a bandwidth policy | `Yes` | *NSS-only* |
| `%s{bwclassname}` | Name of the bandwidth class | `Entertainment`, `General Surfing`, `Office Apps` | Bandwidth Class |
| `%s{bwrulename}` | Name of the bandwidth rule | `Office 365` | Bandwidth Rule |

### Forwarding Control

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{rdr_rulename}` | Name of the redirect/forwarding policy | `FWD_Rule_1` | Forwarding Rule |
| `%s{fwd_type}` | Type of forwarding method used | `Direct`, `Drop`, `Proxy Chaining`, `ZPA` | Forwarding Method |
| `%s{fwd_gw_name}` | Name of the gateway defined in a forwarding rule | `FWD_1` | Gateway Name |
| `%s{fwd_gw_ip}` | IP address of the gateway | `10.1.1.1`, `10.1.1.1-10.1.1.5`, `10.1.1.0/24` | Gateway IP |
| `%s{zpa_app_seg_name}` | Name of the ZPA application segment | `ZPA_test_app_segment` | Application Segment |

### Mobile Application

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{mobappname}` | Name of the mobile app | `Adobe Reader`, `Amazon`, `Dropbox` | Mobile Application |
| `%s{mobappcat}` | Category of the mobile app | `Communication`, `Education`, `Games` | Mobile Application Category |
| `%s{mobdevtype}` | Type of mobile device | `iOS`, `Google Android`, `Apple iPhone` | Mobile Device Type |

### Data Center

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{datacenter}` | Name of the data center | `CA Client Node DC` | Data Center |
| `%s{datacentercity}` | City where the data center is located | `Sa` | *NSS-only* |
| `%s{datacentercountry}` | Country where the data center is located | `US` | *NSS-only* |

### Zscaler Client Connector Device Information

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%s{devicehostname}` | Hostname of the device | `THINKPADSMITH` | Device Hostname |
| `%s{devicemodel}` | Model of the device | `20L8S7WC08` | Device Model |
| `%s{devicename}` | Name of the device | `PC11NLPA:5F08D97BBF43257A8FB4BBF4061A38AE324EF734` | Device Name |
| `%s{devicetype}` | Type of device | `Zscaler Client Connector` | Device Type |
| `%s{deviceostype}` | OS type of the device | `iOS`, `Android OS`, `Windows OS`, `MAC OS`, `Other OS` | OS Type |
| `%s{deviceosversion}` | OS version the device uses | `Version 10.14.2 (Build 18C54)` | OS Version |
| `%s{deviceowner}` | Owner of the device | `jsmith` | Device Owner |
| `%s{deviceappversion}` | App version the device uses | `2.0.0.120` | Enrolled Device appversion |
| `%s{ztunnelversion}` | Z-Tunnel version | `ZTUNNEL_1_0` | Zscaler Client Connector Tunnel Version |
| `%s{external_devid}` | External device ID associating the user's device with MDM | `1234` | External Device ID |
| `%d{bypassed_traffic}` | Whether traffic bypassed Zscaler Client Connector | `1` = bypassed, `0` = not bypassed | Bypassed Transaction |
| `%s{bypassed_etime}` | Date and time when traffic bypassed Zscaler Client Connector | `Mon Oct 16 22:55:48 2023` | Bypassed Transaction Event Time |
| `%s{flow_type}` | Flow type of the transaction | `Direct`, `Loopback`, `VPN`, `VPN Tunnel`, `ZIA`, `ZPA` | Flow Type |

### Miscellaneous

| NSS specifier | Description | Example | Insights name |
|---|---|---|---|
| `%d{recordid}` | Unique record identifier for each log | (no example) | *NSS-only* |
| `%s{pcapid}` | Path of the PCAP file that captured the transaction. Format: `<Company ID>/<Directory>/<PCAP File Name>`. | `43139974/web/663ba8fd30b50001.pcap` | Capture |
| `%s{productversion}` | Current version of the product | `5.0.902.95524_04` | *NSS-only* |
| `%s{nsssvcip}` | Service IP address of the NSS. Useful for syslog-format logs requiring origin host IP. | `10.10.102.300` | *NSS-only* |
| `%s{eedone}` | Whether characters specified in the Feed Escape Character field were hex encoded | `Yes` | *NSS-only* |

## Fields that require additional enablement

Per the CSV, these fields are not logged by default:

- `%d{clt_sport}` (client source port) — "To enable logging for Client Source Port, contact Zscaler Support."
- `%d{srv_dport}` (server destination port) — "To enable logging for Server Destination Port, contact Zscaler Support."
- `%s{dlprulename}` (Allow-rule DLP rule name) — "To enable logging for DLP Allowed Rule Name, contact Zscaler Support."

And these require specific SSL Inspection state:

- `%s{df_hostname}` (domain-fronted SNI) — "TLS Inspection must be enabled for this field to be populated."

## Cross-links

- SPL patterns that query these fields — [`../../shared/splunk-queries.md`](../../shared/splunk-queries.md)
- Decision criteria for when to consult logs — [`../../shared/log-correlation.md`](../../shared/log-correlation.md)
- URL filtering rule semantics (for interpreting rule-label fields) — [`../url-filtering.md`](../url-filtering.md)
- SSL inspection pipeline (for interpreting `%s{ssldecrypted}` + `%s{externalspr}`) — [`../ssl-inspection.md`](../ssl-inspection.md)

## Open questions

- NSS feed format versions — [clarification `log-01`](../../_clarifications.md#log-01-nss-feed-format-versions)
- Cloud NSS vs legacy NSS divergence — [clarification `log-02`](../../_clarifications.md#log-02-cloud-nss-vs-legacy-nss-divergence)
- Timestamp timezone handling across feeds / regions — [clarification `log-03`](../../_clarifications.md#log-03-timestamp-timezone-handling)
