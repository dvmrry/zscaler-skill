# Where ZIA, ZPA and Client Connector logs can be read, and for how long (shared.log-correlation.streams)
Also called: zia log retention; how long are zscaler logs kept; nss vs lss; do i need a siem for older logs; zcc logs in siem; log streaming per product; zia log latency

Each product keeps and exports its logs differently, which decides where a correlation query can run and how far back it can reach.

## ZIA: the Nanolog and NSS

The ZIA Insights Logs article says logs are stored for 180 days in the Zscaler Nanolog servers, and that NSS, a virtual machine, can stream web traffic logs in real time from the Nanolog to a SIEM, enabling real-time alerting, correlation with the logs of firewalls and other devices, and long-term local log archival. [shared.log-correlation.streams:zia-retention] The ZIA Insights Logs article says the Zscaler service performs global time-ordered log consolidation, with a potential latency of several seconds to a few minutes. [shared.log-correlation.streams:zia-consolidation-latency]

Web and firewall logs are held in the Nanolog, and each NSS receives copies: [Web and Firewall logs are stored in the Nanolog in the Zscaler cloud; each NSS receives copies from the Nanolog, then decompresses, detokenizes, filters and converts them to the configured output format.](kb:zia.logs.nss-feed-format:one-store). A Cloud NSS instance takes one feed per log type: [A Cloud NSS instance supports one feed per Internet and SaaS log type, and the feed format is customizable, with JSON recommended.](kb:zia.logs.nss-feed-format:cloud-feed-limit). The web, firewall and DNS feeds each have their own field set: [ZIA web log (NSS web feed)](kb:zia/web-log), [ZIA firewall log (NSS firewall feed)](kb:zia/firewall-log), [ZIA DNS log (NSS DNS feed)](kb:zia/dns-log). VM-based and Cloud NSS deployment is described in [VM-based NSS and Cloud NSS: subscriptions, transport and what each needs](kb:shared.nss.delivery-modes), and the feed format specifiers in [In the Feed Output Format each field name is replaced by its value: `%s{<fieldname>}` prints a string, `%d{<fieldname>}` a decimal number and `%x{<fieldname>}` a hexadecimal number; static text and padding for constant width are allowed, and % is escaped with another %.](kb:shared.nss.feeds:format-specifiers).

## ZPA: the Log Streaming Service

LSS streams through a Public Service Edge to an App Connector that forwards to the log receiver, and it is separate from NSS: [LSS is deployed using two components, a log receiver and an App Connector: LSS resides in the Zero Trust Exchange and starts a log stream through a Public Service Edge, and the App Connector in the company's environment receives the stream and forwards it to the log receiver.](kb:zpa.log-receivers.architecture:two-components), [LSS captures log data about App Connectors and users in Private Access, while the Nanolog Streaming Service resides in Internet & SaaS (ZIA) and streams traffic logs from the Zscaler Nanolog to a SIEM.](kb:zpa.log-receivers.architecture:not-nss). A receiver can carry nineteen log types: [The Log Streaming Service page lists nineteen log types a receiver can capture: AppProtection, Audit Logs, App Connector Metrics, App Connector Status, Browser Access Logs, Business Continuity Event Log Fields, KRB Inspection Logs, LDAP Inspection Logs, Microsegmentation, Private Cloud Controller Metrics and Status, two User Status VPN Service Edge types, Traffic Flow - VPN, Private Service Edge Metrics and Status, SMB Inspection Logs, User Activity and User Status.](kb:zpa.log-receivers.log-types:help-log-types). User Activity, User Status and App Connector logs are retained for at least 14 days and audit logs for at least 6 months: [Zscaler retains User Activity, User Status and App Connector log information for rolling periods of at least 14 days and audit log information for at least 6-month periods, during the subscription term.](kb:zpa.log-receivers.delivery:cloud-retention). Data generated during a connection loss is not delivered except as the help describes: [After a connection loss between Private Access and the App Connectors, LSS does not send the log data generated during the loss; after the connection is restored it can retransmit the last 15 minutes of log data, with delivery not guaranteed. During a loss between the App Connector and the SIEM, LSS sends nothing for that period except audit logs.](kb:zpa.app-connectors.health:lss-retransmit-limits). Mutual TLS between connector and receiver is optional and has certificate requirements: [TLS between the App Connector and the log receiver](kb:zpa.log-receivers.tls).

## Client Connector: logs on the device

Client Connector's log is collected from the device, by user export or an admin fetch: [With the controls visible, users can see where the encrypted logs are stored, export logs as a ZIP file from the tray menu, send encrypted logs to support by email with copies to others, change the log mode, and clear logs.](kb:zcc.logging.user-access:visible-capabilities), [An admin can pull logs from an enrolled device with Fetch Logs or Fetch Lightweight Logs on its device details, once Client Connector App Logs is enabled and an email address is configured on the App Supportability tab.](kb:zcc.logging.collection:fetch-prereq). Whether it records individual transactions is open: [Absence of transaction records in the client log](kb:zcc.logs.client-log:transaction-records). Whether any Client Connector log reaches a SIEM directly is open [gap:shared.log-correlation.streams:zcc-siem-stream]; the ZIA view of its traffic is in [Client Connector traffic, devices and bypasses as seen in ZIA logs](kb:shared.log-correlation.zcc-in-zia).

## Cloud Connector

Cloud Connector's log paths are described in [Cloud Connector logs: which log types exist and where to read them](kb:cloud-connector.logs).

What to check:
1. Before querying, check that the window is inside what the source still holds: 180 days in the Nanolog for ZIA Insights logs, at least 14 days for ZPA User Activity, User Status and App Connector logs in the console; beyond that only a SIEM copy has it.
2. For very recent events, allow for ZIA's consolidation latency before concluding a record is missing.

Not known (open gaps):
- Whether any Client Connector log reaches a SIEM directly [gap:shared.log-correlation.streams:zcc-siem-stream]: settled by source-read or support-ticket. Blocks: Answering whether Client Connector events can be searched in a SIEM

Area: shared.log-correlation, its subjects in references/_meta/spine/shared/shared.log-correlation.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)
- links-to references/_meta/text/shared/shared.log-correlation.zcc-in-zia.md (Client Connector traffic, devices and bypasses as seen in ZIA logs)
- links-to references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.logging.user-access.md (What users can do with Client Connector logs: logging controls and readable exports)
- links-to references/_meta/text/zcc/zcc.logs.client-log.md (What the Client Connector log on the device records)
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.log-receivers.delivery.md (Retention and delivery guarantees for ZPA logs)
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- links-to references/_meta/text/zpa/zpa.log-receivers.tls.md (TLS between the App Connector and the log receiver)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service)
