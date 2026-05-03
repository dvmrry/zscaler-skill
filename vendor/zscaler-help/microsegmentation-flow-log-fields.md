# Understanding Microsegmentation Flow Log Fields

**Source:** https://help.zscaler.com/zpa/understanding-microsegmentation-flow-log-fields
**Captured:** 2026-04-28 via Playwright MCP.

The Log Streaming Service (LSS) can send Microsegmentation network flow log information to any third-party log analytics tool. By default, the Microsegmentation network flow log type includes the fields listed in the following table for each log template (i.e., CSV, JSON, TSV). While configuring your log receiver, you can edit the default log stream content to capture only specific fields, and create a custom log template.

## Field Table

| Field | Description | Supported Field Format Specifications |
|---|---|---|
| LogTimestamp | The timestamp when the log was generated | %[OPT]s, %[OPT]j |
| Customer | The customer name | %[OPT]s, %[OPT]j |
| AgentID | The Microsegmentation agent ID (192-bit string) | %[OPT]s, %[OPT]j |
| AgentName | The Microsegmentation agent name | %[OPT]s, %[OPT]j |
| ResourceID | The resource ID associated with the agent generating the flow log (192-bit string) | %[OPT]s, %[OPT]j |
| ResourceName | The resource name associated with the agent generating the flow log | %[OPT]s, %[OPT]j |
| AppZoneID | The AppZone identifier the agent generating the flow log belongs to (192-bit string) | %[OPT]s, %[OPT]j |
| AppZoneName | The AppZone name the agent generating the flow log belongs to or is a member of | %[OPT]s, %[OPT]j |
| ConnectionStartTime | The timestamp when the earliest of an aggregated set of connections was initiated | %[OPT]s, %[OPT]j |
| SourceIP | The source IP address used in the connection | %[OPT]s, %[OPT]j |
| DestinationIP | The destination IP address used in the connection | %[OPT]s, %[OPT]j |
| SourcePorts | The source port used in the connection. In the case of multiple connections between the same endpoints (same source, destination address, protocol, and destination port), this becomes an aggregated source port list. | %[OPT]d |
| DestinationPort | The destination port used in the connection | %[OPT]d |
| Protocol | The transport protocol used in the connection | %[OPT]d |
| AppName | The application name | %[OPT]s, %[OPT]j |
| AppExecutablePath | The underlying operating system path of the application generating the connection | %[OPT]s, %[OPT]j |
| Direction | The connection direction. Allowed values: UNKNOWN, INBOUND, OUTBOUND | %[OPT]s, %[OPT]j |
| PolicyID | The policy ID | %[OPT]s, %[OPT]j |
| PolicyName | The policy name | %[OPT]s, %[OPT]j |
| EnforcementReason | The policy enforcement configured on the connection. Allowed values: POLICY_DISABLED, RULE, NO_POLICY_EXISTS, FORCED | %[OPT]s, %[OPT]j |
| EnforcementAction | The policy enforcement action configured on the connection. Allowed values: ALLOW, BLOCK, SIMBLOCK | %[OPT]s, %[OPT]j |
| EnforcementDisposition | The policy enforcement decision on the connection. Allowed values: UNKNOWN, CONNECTED, REJECTED, DROPPED | %[OPT]s, %[OPT]j |
