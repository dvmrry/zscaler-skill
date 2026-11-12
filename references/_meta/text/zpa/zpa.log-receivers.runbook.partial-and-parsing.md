# What the LSS runbook checks for partial logs and for log syntax or parsing issues on the SIEM (zpa.log-receivers.runbook.partial-and-parsing)
Also called: Partial Log Received on SIEM Server; Log Syntax or Parsing Issues on SIEM

**Partial logs.** For partial logs on the SIEM the runbook lists missing events or gaps on SIEM dashboards and discrepancies between Private Access Diagnostics logs and the SIEM data, and says the problem typically lies in constrained log filters or SIEM limitations processing high log volumes. [zpa.log-receivers.runbook.partial-and-parsing:partial-symptoms-cause] The runbook reviews any filters applied on the logs, giving LogType (for example User Activity) and Policy (for example Client Types: Web Browser) as examples, and says to modify filters to expand the scope, if necessary. [zpa.log-receivers.runbook.partial-and-parsing:partial-filters] Traffic between the App Connector and SIEM is monitored for packet drops from high latency or overload, using TCPdump enabled from Support Information in the Admin Console or from the App Connector SSH session. [zpa.log-receivers.runbook.partial-and-parsing:partial-network] The runbook validates there are no connection resets coming from the SIEM server and, if there are any, investigates SIEM concurrent-connection or buffer limitations and intermediary devices such as firewalls or load balancers, bypassing them if feasible. [zpa.log-receivers.runbook.partial-and-parsing:partial-resets]

**Parsing issues.** Log syntax or parsing issues show as logs dropped or ignored by the SIEM, SIEM errors about failed ingestion or syntax incompatibility, and SIEM alerts or dashboards not populating; the runbook attributes them to a mismatch between the structure and format of the logs Private Access sends and the format the SIEM expects. [zpa.log-receivers.runbook.partial-and-parsing:parsing-symptoms] For parsing issues the runbook verifies the configured format matches the SIEM's expected format, checks the SIEM is set to consume CEF if CEF is selected, tests a Custom log template against a predefined CSV, TSV or JSON template, and adjusts or recreates the SIEM parsing rules or templates. [zpa.log-receivers.runbook.partial-and-parsing:parsing-format-checks] [divergence:zpa.log-receivers.runbook.partial-and-parsing:cef-format]

Sources disagree (name both sides):
- Whether CEF is a stream format for Private Access: the runbook names CEF as a format that can be selected, while the receiver configuration page offers CSV, TSV, JSON and Custom log templates. [divergence:zpa.log-receivers.runbook.partial-and-parsing:cef-format]
  - zscaler-help: The runbook says that if CEF is selected, the SIEM must be configured to consume CEF.
  - zscaler-help: The receiver configuration page lists the Log Template options as CSV, TSV, JSON and Custom (which appears when the Log Stream Content is edited); none is CEF.
  Impact: A CEF step in the runbook may not apply to a Private Access receiver; the captured pages do not say where CEF would be selected, so a CEF-formatted stream needs to be confirmed in the tenant.

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.runbook.md (How the Private Access LSS support troubleshooting runbook describes retention, the log flow and its three common issues)
- see-also references/_meta/text/zpa/zpa.log-receivers.runbook.no-logs.md (What the LSS runbook checks when no logs arrive on the SIEM: receiver configuration, connector status, connectivity and the TLS handshake)
- see-also references/_meta/text/zpa/zpa.log-receivers.filtering.md (Narrowing a ZPA log stream: status codes and streaming policy)
- see-also references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
