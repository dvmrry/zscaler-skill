# ZPA log receivers and the Log Streaming Service (zpa.log-receivers)
Also called: LSS; log streaming service; zpa log receiver; lssConfig; zpa_lss_config_controller; siem log streaming zpa; zpa logs to splunk; lss configuration; log receivers

A log receiver is the ZPA object that sends one log type to a SIEM or log collector through an App Connector.

1. **How does the stream travel, and what must exist first?** [How the Log Streaming Service reaches a SIEM](kb:zpa.log-receivers.architecture).
2. **Which log types can a receiver carry, and under which codes?** [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types).
3. **What does a receiver hold, and what is required?** [What a ZPA log receiver holds and which fields are required](kb:zpa.log-receivers.configuration).
4. **How is the output shaped?** [Log stream format and content templates for a ZPA log receiver](kb:zpa.log-receivers.formats).
5. **How is the stream narrowed?** [Narrowing a ZPA log stream: status codes and streaming policy](kb:zpa.log-receivers.filtering).
6. **How is the connection secured?** [TLS between the App Connector and the log receiver](kb:zpa.log-receivers.tls).
7. **How long are logs kept, and what is lost in an outage?** [Retention and delivery guarantees for ZPA logs](kb:zpa.log-receivers.delivery).
8. **Which endpoints and SDK calls manage receivers?** [Managing ZPA log receivers through the API and SDKs](kb:zpa.log-receivers.api).
9. **What does the Admin Console page offer?** [The Log Receivers page in the Admin Console](kb:zpa.log-receivers.admin-console).
10. **How are logs sent to Splunk?** [Sending Private Access logs to Splunk with LSS: the TA and App, source types, index and TCP input](kb:zpa.log-receivers.splunk).

Admin audit logs are one log type with their own subject: [ZPA admin audit logs](kb:zpa.audit-logs). Provider and SDK defects that affect receivers are in [What ZPA Terraform data sources return, drop, or get wrong](kb:zpa.terraform.data-source-fidelity) and [ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps](kb:zpa.terraform.resource-fidelity).

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors): App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- links-to references/_meta/text/zpa/zpa.audit-logs.md (ZPA admin audit logs)
- links-to references/_meta/text/zpa/zpa.log-receivers.admin-console.md (The Log Receivers page in the Admin Console)
- links-to references/_meta/text/zpa/zpa.log-receivers.api.md (Managing ZPA log receivers through the API and SDKs)
- links-to references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
- links-to references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
- links-to references/_meta/text/zpa/zpa.log-receivers.delivery.md (Retention and delivery guarantees for ZPA logs)
- links-to references/_meta/text/zpa/zpa.log-receivers.filtering.md (Narrowing a ZPA log stream: status codes and streaming policy)
- links-to references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- links-to references/_meta/text/zpa/zpa.log-receivers.splunk.md (Sending Private Access logs to Splunk with LSS: the TA and App, source types, index and TCP input)
- links-to references/_meta/text/zpa/zpa.log-receivers.tls.md (TLS between the App Connector and the log receiver)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.api.lss-wire.md (What the SDKs and provider send for a ZPA log receiver (LSS))
- see-also references/_meta/text/zpa/zpa.log-receivers.runbook.md (How the Private Access LSS support troubleshooting runbook describes retention, the log flow and its three common issues)
