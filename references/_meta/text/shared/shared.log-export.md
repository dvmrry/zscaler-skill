# Where each Zscaler product's logs go and how to get them out (shared.log-export)
Also called: log export; where do i find this log; which log stream has; export logs to siem; nss vs lss vs cloud nss; zscaler log sources; log export architecture

Each product has its own way out. Find the product first, then the path.

| Logs | Path out | Described in |
| --- | --- | --- |
| ZIA web, firewall, DNS, tunnel and the other ZIA log types | An NSS feed on VM-based NSS or Cloud NSS [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) | [Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud](kb:shared.nss), [VM-based NSS and Cloud NSS: subscriptions, transport and what each needs](kb:shared.nss.delivery-modes) |
| ZIA admin audit log | An admin audit feed [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming) | [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming) |
| ZIA SaaS Security scan records | A SaaS Security feed [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs) | [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs) |
| ZPA user activity, user status, App Connector, audit and other Private Access logs | A log receiver fed by App Connectors [How the Log Streaming Service reaches a SIEM](kb:zpa.log-receivers.architecture) | [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers), [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types) |
| Client Connector logs | Kept on the device; collected by export, Report an Issue or Fetch Logs [Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures](kb:zcc.logging.collection) | [Client Connector logs: verbosity, user access and collection](kb:zcc.logging), [What the Client Connector log on the device records](kb:zcc.logs.client-log) |
| ZDX scores, alerts and device data | The ZDX API [Getting ZDX data out: the ZDX API, its windows and delays](kb:shared.log-export.zdx) | [Getting ZDX data out: the ZDX API, its windows and delays](kb:shared.log-export.zdx) |
| Cloud Connector session logs and Insights | Not converted yet [Cloud Connector logs: which log types exist and where to read them](kb:cloud-connector.logs) | [NSS for Cloud & Branch Connector: how connector logs reach a SIEM](kb:cloud-connector.nss-va) |
| Third-party firewall and proxy logs, inbound | The NSS Collector [NSS Collector: third-party firewall and proxy logs into the SaaS Security Report](kb:shared.nss.collector) | [NSS Collector: third-party firewall and proxy logs into the SaaS Security Report](kb:shared.nss.collector) |

**DLP and Sandbox.** The web feed carries inline DLP and Sandbox fields: [ZIA web log (NSS web feed)](kb:zia/web-log), [dlprulename applies only to Allow rules; trig_dlprulename names the DLP rule that triggered the transaction, allowed or blocked; all_dlprulenames combines other_dlprulenames and trig_dlprulename.](kb:zia.logs.web-field-semantics:dlp-rule-fields), [malwarecat holds the malware category detected in the transaction and also indicates whether a file was submitted to the Sandbox engine and the analysis result.](kb:zia.logs.web-field-semantics:malwarecat-sandbox). Endpoint DLP, Email DLP and Sandbox Verdict logs also have feeds of their own: [The help has configuration articles for TCP NSS feeds and for Cloud NSS feeds for the same fifteen log types: Web, Firewall, DNS, Tunnel, SaaS Security, SaaS Security Activity, Alerts, Admin Audit, Endpoint DLP, Email DLP, Sandbox Verdict, Authentication, SCIM, 3rd-Party App Governance and Posture Management.](kb:shared.nss.feeds:feed-log-types).

**Delivery differs by path.** NSS recovery and retry rules are in [What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery](kb:shared.nss.reliability). What ZPA's stream keeps after a connection loss depends on which link was lost: [After a connection loss between Private Access and the App Connectors, LSS does not send the log data generated during the loss; after the connection is restored it can retransmit the last 15 minutes of log data, with delivery not guaranteed. During a loss between the App Connector and the SIEM, LSS sends nothing for that period except audit logs.](kb:zpa.app-connectors.health:lss-retransmit-limits), with retention in [Retention and delivery guarantees for ZPA logs](kb:zpa.log-receivers.delivery).

**LSS is a separate path.** TLS between App Connector and receiver is optional, not required: [Mutual TLS between the log receiver and the App Connector can be enabled when configuring a log receiver, and LSS traffic flows between them only after mutual authentication is established, which requires them to exchange certificates.](kb:zpa.log-receivers.tls:mutual-tls-optional). Whether LSS shares the Nanolog store with NSS is not stated [gap:shared.log-export:lss-store].

**Client Connector logs are not a SIEM stream.** What users can export and when it is readable is [What users can do with Client Connector logs: logging controls and readable exports](kb:zcc.logging.user-access); whether the client log records individual transactions is open in [What the Client Connector log on the device records](kb:zcc.logs.client-log).

**Landing in a SIEM.** Which log type to look for and how it tends to be named in a SIEM: [Zscaler log types and where they land in a SIEM](kb:shared.siem-mapping). Joining records across streams: [Correlating ZIA, ZPA and Client Connector logs](kb:shared.log-correlation).

What to check:
1. For a per-URL allow or block decision, read the ZIA web log and its rule fields rather than the Client Connector log.
2. For a gap in a SIEM, which path the log type takes before applying a recovery rule: NSS or LSS.

Not known (open gaps):
- Whether LSS reads from the Nanolog [gap:shared.log-export:lss-store]: settled by support-ticket. Blocks: reasoning about whether a Nanolog outage affects ZPA log streaming

Area: shared.log-export, its subjects in references/_meta/spine/shared/shared.log-export.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/shared/shared.nss.collector.md (NSS Collector: third-party firewall and proxy logs into the SaaS Security Report)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/zcc/zcc.logs.client-log.md (What the Client Connector log on the device records)
- links-to references/_meta/text/zia/zia.audit-logs.streaming.md (Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT))
- links-to references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming)
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)
- links-to references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM)
- links-to references/_meta/text/shared/shared.log-correlation.md (Correlating ZIA, ZPA and Client Connector logs)
- links-to references/_meta/text/shared/shared.nss.md (Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud)
- links-to references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs)
- links-to references/_meta/text/shared/shared.nss.reliability.md (What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery)
- links-to references/_meta/text/shared/shared.siem-mapping.md (Zscaler log types and where they land in a SIEM)
- links-to references/_meta/text/zcc/zcc.logging.md (Client Connector logs: verbosity, user access and collection)
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.logging.user-access.md (What users can do with Client Connector logs: logging controls and readable exports)
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service)
- links-to references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
- links-to references/_meta/text/zpa/zpa.log-receivers.delivery.md (Retention and delivery guarantees for ZPA logs)
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- links-to references/_meta/text/zpa/zpa.log-receivers.tls.md (TLS between the App Connector and the log receiver)
