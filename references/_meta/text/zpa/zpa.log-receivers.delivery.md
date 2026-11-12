# Retention and delivery guarantees for ZPA logs (zpa.log-receivers.delivery)
Also called: lss retention; lss 15 minute retransmit; lss log loss; zpa log retention 14 days; lss delivery guarantee; permanent log gap

Zscaler keeps logs for a limited time, and LSS is the way to keep them longer; delivery to the SIEM is not guaranteed.

**Retention.** Zscaler retains User Activity, User Status and App Connector log information for rolling periods of at least 14 days and audit log information for at least 6-month periods, during the subscription term. [zpa.log-receivers.delivery:cloud-retention] Access to logs beyond the period they are available in the Admin Console requires setting up LSS, and storing logs longer than the cloud retention period is one of its stated benefits. [zpa.log-receivers.delivery:lss-extends] The Diagnostics pages give a different console availability [ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export](kb:zpa.troubleshooting.diagnostics). Audit logs are worded differently on their own page [divergence:zpa.log-receivers.delivery:audit-retention-wording].

**Delivery.** The loss and retransmit behavior, including the exception for audit logs, is in [App Connector health, status values and telemetry](kb:zpa.app-connectors.health). LSS attempts to resend a log if it determines that the SIEM system has not received it. [zpa.log-receivers.delivery:resend-on-nonreceipt] After a loss between Private Access and the App Connectors, the help says LSS can retransmit the last 15 minutes of the log data, with delivery not guaranteed; it does not say what happens to older data. [zpa.log-receivers.delivery:older-than-window]

**Compared with NSS.** The ZIA Cloud NSS recovery window is in [How NSS feeds encode and deliver ZIA log fields](kb:zia.logs.nss-feed-format).

What the audit-log exception actually does is open [Streaming ZPA audit logs to a SIEM: log type, fields, filtering](kb:zpa.audit-logs.streaming).

What to check:
1. Whether the missing logs are older than the cloud retention period (14 days for activity, status and connector logs; 6 months for audit).
2. Whether the gap matches a connection loss, and on which leg: Private Access to App Connector, or App Connector to SIEM.
3. Whether a long-term copy was already being streamed, since the cloud keeps the logs only for the retention period.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.log-receivers.delivery:older-than-window] Tier B: The help states only the 15-minute retransmit and that delivery is not guaranteed.

Sources disagree (name both sides):
- Audit-log retention is worded as at least 6-month periods on the Log Streaming Service page and as up to 6 months on the Audit Logs page. [divergence:zpa.log-receivers.delivery:audit-retention-wording]
  - zscaler-help: Retained for at least 6-month periods.
  - zscaler-help: Stored for up to 6 months.
  Impact: See zpa.audit-logs.what-is-recorded: a floor and a ceiling are not the same promise.

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry): After a connection loss between Private Access and the App Connectors, LSS does not send the log data generated during the loss; after the connection is restored it can retransmit the last 15 minutes of log data, with delivery not guaranteed. During a loss between the App Connector and the SIEM, LSS sends nothing for that period except audit logs. [zpa.app-connectors.health:lss-retransmit-limits]
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/zpa/zpa.audit-logs.streaming.md (Streaming ZPA audit logs to a SIEM: log type, fields, filtering)
- links-to references/_meta/text/zpa/zpa.troubleshooting.diagnostics.md (ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled)
- see-also references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
