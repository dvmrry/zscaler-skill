# How the Private Access LSS support troubleshooting runbook describes retention, the log flow and its three common issues (zpa.log-receivers.runbook)
Also called: Private Access Log Streaming Service (LSS) Support Troubleshooting Runbook; LSS support runbook

**Retention.** The LSS runbook says Zscaler retains user activity, user status and App Connector log information for rolling periods of at least 14 days, and audit log information for 6-month periods, during the subscription term; the 6-month wording carries no "at least" or "up to". [zpa.log-receivers.runbook:retention] [divergence:zpa.log-receivers.runbook:audit-retention-bound] The full retention wording is in [Retention and delivery guarantees for ZPA logs](kb:zpa.log-receivers.delivery).

**What LSS does.** LSS lets an admin forward diagnostics and status logs to a SIEM, store logs longer than the cloud retention period, build charts in an in-house SIEM, and create events and alerts with third-party log correlation; it has two components, a Log Receiver (SIEM) and an App Connector. [zpa.log-receivers.runbook:benefits-components] Each user request creates a microtunnel toward a Public or Private Service Edge, generating a log that is sent to Zscaler's backend logging servers, which makes the logs available on the Admin Console; if SIEM integration is enabled for the log type the Service Edge also forwards a copy to the LSS Client. [zpa.log-receivers.runbook:connection-flow] The LSS client's logging activity is itself logged in Private Access Diagnostics and the Users dashboard, and, as the runbook puts it, depending on the amount of logs generated the LSS Client can appear among the Top Users by Bandwidth. [zpa.log-receivers.runbook:lss-client-visibility]

**Common issues.** The LSS runbook's common-issues sections include: no logs received on the SIEM server, partial logs received, and log syntax or parsing issues on the SIEM. [zpa.log-receivers.runbook:symptom-routing] No logs on the SIEM is in [What the LSS runbook checks when no logs arrive on the SIEM: receiver configuration, connector status, connectivity and the TLS handshake](kb:zpa.log-receivers.runbook.no-logs), and partial logs and parsing issues are in [What the LSS runbook checks for partial logs and for log syntax or parsing issues on the SIEM](kb:zpa.log-receivers.runbook.partial-and-parsing).

Sources disagree (name both sides):
- Which side of 6 months bounds ZPA audit log retention: the LSS runbook says 6-month periods, the Log Streaming Service page says at least 6-month periods, and the Audit Logs page says up to 6 months. [divergence:zpa.log-receivers.runbook:audit-retention-bound]
  - zscaler-help: The LSS runbook says audit log information is retained for 6-month periods, with no bound stated.
  - zscaler-help: The Log Streaming Service page says audit log information is retained for at least 6-month periods (a floor).
  - zscaler-help: The Audit Logs page says audit logs are stored for up to 6 months (a ceiling).
  Impact: An answer that treats 6 months as guaranteed, or as a limit, rests on one of the wordings; the runbook's own sentence does not say which.

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- links-to references/_meta/text/zpa/zpa.log-receivers.delivery.md (Retention and delivery guarantees for ZPA logs)
- links-to references/_meta/text/zpa/zpa.log-receivers.runbook.no-logs.md (What the LSS runbook checks when no logs arrive on the SIEM: receiver configuration, connector status, connectivity and the TLS handshake)
- links-to references/_meta/text/zpa/zpa.log-receivers.runbook.partial-and-parsing.md (What the LSS runbook checks for partial logs and for log syntax or parsing issues on the SIEM)
