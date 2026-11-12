# Client Connector flow logging on Windows (zcc.logs.flow-logging)
Also called: zcc flow logging; flow logger; flowLoggerConfig; unclassified flow; zcc direct traffic logging

Flow Logging, an app profile option on Windows, installs a WFP-based Zscaler driver that logs flows to capture traffic Client Connector excludes; it needs Install WFP Driver and is enabled by Zscaler Support. [zcc.logs.flow-logging:flow-logging] Client Connector logs and reports traffic flows to Internet & SaaS for the areas enabled: traffic through the Private Access tunnel, direct traffic that neither Zscaler nor a VPN handles, and traffic Client Connector itself blocks (Unclassified Flow). [zcc.logs.flow-logging:flow-areas] By default, traffic bypassed from Client Connector is not logged. When flow logging is enabled in App Profiles with VPN selected to capture traffic logs for bypassed data, a VPN service name must be added if the VPN service is not already listed, in the VPN Services for Flow Logging field on the Endpoint Integration tab, to classify traffic flow into a VPN tunnel; the name can be up to 65 characters, and the page says to contact Zscaler Support to enable this feature. [zcc.logs.flow-logging:vpn-service-names] Which VPN services are pre-listed, and what feature the page's Support contact enables, are open [gap:zcc.logs.flow-logging:vpn-service-list].

**In the API.** The web policy's Windows block carries `flowLoggerConfig`, which matches Flow Logging by name; the API reference gives it no description. [zcc.logs.flow-logging:api-field] The Go SDK's company-info model also has flow-logger fields (`enableFlowLogger`, `flowLoggingBufferLimit`, `flowLoggingTimeInterval` and per-area `flowLogger…Visibility` flags), and its web policy model has `flowLoggingSelected`; they match Flow Logging by name only. [zcc.logs.flow-logging:go-flow-fields]

**Records.** Where the reported flows appear in ZIA and what their fields are is not captured [gap:zcc.logs.flow-logging:flow-record-fields].

What to check:
1. Whether the Windows app profile enables Flow Logging and Install WFP Driver before expecting flow records for direct or ZPA traffic.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.logs.flow-logging:api-field] Tier B: Name correspondence only; no source maps flowLoggerConfig to the console option or documents its value.
- [zcc.logs.flow-logging:go-flow-fields] Tier B: Name correspondence only; no source documents these fields or maps them to console options.

Not known (open gaps):
- Which VPN services are pre-listed for flow logging and what Support enables [gap:zcc.logs.flow-logging:vpn-service-list]: settled by tenant-data or support-ticket
- Where flow-logging records appear and their fields [gap:zcc.logs.flow-logging:flow-record-fields]: settled by source-read or tenant-data

Area: zcc.logs, its subjects in references/_meta/spine/zcc/zcc.logs.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)): Flow Logging, an app profile option on Windows, installs a WFP-based Zscaler driver that logs flows to capture traffic Client Connector excludes; it needs Install WFP Driver and is enabled by Zscaler Support. [zcc.logs.flow-logging:flow-logging]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.logs.client-log.md (What the Client Connector log on the device records)
- see-also references/_meta/text/zcc/zcc.logging.md (Client Connector logs: verbosity, user access and collection)
