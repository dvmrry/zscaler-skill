# Understanding Nanolog Streaming Service (NSS)

**Source:** https://help.zscaler.com/zia/understanding-nanolog-streaming-service
**Captured:** 2026-04-23 via Playwright MCP (all accordion sections expanded before `innerText` extraction).

---

Internet & SaaS (ZIA) Help — Nanolog Streaming Service — Understanding Nanolog Streaming Service (NSS)

Zscaler's Nanolog Streaming Service (NSS) is a family of products that enable Zscaler cloud communication with third-party security solution devices for exchanging event logs.

## Log Streaming

Streams all logs from the Zscaler Nanolog to your SIEM with two offerings:

- **Virtual machine (VM)-based NSS**: Uses a VM set within your network to stream logs to your SIEM over a raw TCP connection.
- **Cloud NSS**: Uses an HTTPS API feed to push logs to an HTTPS API-based log collector on your SIEM.

Through SIEM integration, you can enable real-time alerting, correlate Zscaler logs with other devices, and set up long-term log archival.

## About VM-based NSS

NSS uses a deployed virtual machine (VM) to stream logs to your SIEM system. Zscaler offers the following subscriptions:

- **NSS for Web**: Streams web and mobile traffic logs.
- **NSS for Firewall**: Streams logs from the Zscaler Firewall.

Web and Firewall logs are stored in the Nanolog in the Zscaler cloud. Each NSS opens a secure tunnel to the Nanolog, which streams **copies** of the logs to each NSS in a compressed format. **Original logs are retained in the Nanolog.**

When an NSS receives logs from the Nanolog, it:
1. Decompresses and detokenizes them
2. Applies configured filters to exclude unwanted logs
3. Converts filtered logs to the configured output format for SIEM parsing
4. Streams to SIEM over a raw TCP connection

### Reliability Mechanisms

- **NSS to SIEM**: VM buffers logs in memory for resiliency. If the connection drops, NSS replays logs from the buffer per the Duplicate Logs setting.
- **Nanolog to NSS**: If connectivity between Zscaler cloud and NSS is interrupted, the NSS misses logs that arrived at the Nanolog cluster during the interruption. When restored, **NSS one-hour recovery** (requires contacting Zscaler Support to enable) allows the Nanolog to replay logs up to one hour back.

## About Cloud NSS

Optionally subscribe to Cloud NSS for direct cloud-to-cloud log streaming into a compatible cloud-based SIEM without on-premises connectors. Two subscriptions: Cloud NSS for Web and Cloud NSS for Firewall.

Instead of deploying/managing NSS VMs, you configure an HTTPS API feed to push logs from the Zscaler cloud into an HTTPS API-based log collector on your SIEM. Cloud NSS supports a customizable HTTPS outbound connector, allowing interoperability with most private and public cloud-based SIEMs that support a stateless log ingestion API. Zscaler can POST batches of logs if the SIEM exposes a publicly routable HTTPS log collection API (e.g., Splunk HTTP Event Collector).

If the connection between the Nanolog cluster and the SIEM is interrupted, logs are not delivered. When restored, Cloud NSS one-hour recovery (separate Zscaler capability) allows the Nanolog to replay logs up to one hour back.

**Feed constraint**: You can create **one Cloud NSS feed per ZIA log type per Cloud NSS instance**. When configuring a Cloud NSS feed, the format is customizable; Zscaler recommends JSON.

## Comparison between VM-based NSS and Cloud NSS

|  | Benefits | Limitations | Requirements |
|---|---|---|---|
| **VM-based NSS** | Operates with minimal administration after deployment; automatically polls the Zscaler service for updates; supports a customizable feed format; supports a separate alerts feed for monitoring; buffers logs in VM memory | Supports up to 16 NSS feeds per NSS server (Web and Firewall each limited to 8 feeds per server) | Requires a virtual appliance for deployment |
| **Cloud NSS** | Operates without an additional VM within your network; supports a customizable HTTPS outbound connector; supports a customizable feed format (JSON recommended); includes CloudOps 24/7 monitoring and alerting | Supports one Cloud NSS feed per ZIA log type per Cloud NSS instance | Requires a separate concurrent subscription |

## Log Collection (NSS Collector)

Collects traffic logs from third-party vendors' firewall and web proxy devices inside your network perimeter and streams them to the Zscaler cloud for Shadow IT Report. **Exclusive to Shadow IT Report.**

NSS Collector:
- Must be deployed on VMware within your organization's network perimeter.
- Collects syslog feeds from one or many firewall devices in **CEF format over a TCP connection**.
- Resolves user info via IdP integration (unmanaged users → "Unidentified Users").
- Resolves URL info for cloud-app discovery.
- Securely transmits processed log data to Zscaler cloud over HTTPS.
- Maintains a **one-hour buffer** to avoid data loss during interruption.
- **Records older than one hour are dropped** from the stream (no historical load).
- **10K events/second rate limit** — exceeding events are dropped.
- Up to **4 NSS Collector servers** per organization.
- Third-party device logs retained for **6 months** on Zscaler side.
