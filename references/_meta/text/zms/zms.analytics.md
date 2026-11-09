# What the Microsegmentation Data Explorer log pages list: flow logs, aggregations, connection status, telemetry and events (zms.analytics)
Also called: zms flow logs; zms event logs; agent telemetry microsegmentation; agent connection status logs; flow log aggregations

The time range filter on the Flow Logs, Agent Connection Status Logs, Agent Telemetry and Event Logs pages, and on Flow Log Aggregations, goes up to the last 14 days. [zms.analytics:time-range-14d]

**Flow Logs.** The Flow Logs page lists Timestamp, Source IP, Destination IP, Destination Port, Protocol, Action (Allow, Block or Sim Block), AppZone Name and Agent ID for each flow log; no filters are applied by default. [zms.analytics:flow-log-columns] If two or more matching events occur within the flow log aggregation interval, they are combined into one flow log entry whose count is greater than one. [zms.analytics:flow-log-count]

**Flow Log Aggregations.** Flow Log Aggregations filters by AppZone and then by source and destination resource groups, and lists Source, Destination, Destination Port, Protocol (TCP or UDP), Action (Allow, Block, Sim Block), Policy and Count; no filters are applied by default. [zms.analytics:aggregation-page]

**Agent logs.** The Agent Connection Status Logs page, meant to help troubleshoot connection issues, lists Date, Status (authentication status), Authentication/Disconnect Time, Agent Name, Agent Controller Name and Agent Public IP. [zms.analytics:connection-status-columns] The Agent Telemetry page lists, per agent, Timestamp (last usage), Agent CPU Util (%), Agent Memory Util (MB) and Agent ID. [zms.analytics:telemetry-columns]

**Event Logs.** The Event Logs page counts Total, High, Medium and Low priority events and lists Timestamp, Event Name, Category, Component Name and Priority (Low, Medium or High). [zms.analytics:event-log-columns]

**Open questions.** The aggregation interval has no stated value [gap:zms.analytics:aggregation-interval]. The telemetry CPU unit is garbled in the page [gap:zms.analytics:telemetry-cpu-unit]. Several field values are not enumerated [gap:zms.analytics:values-not-enumerated].

**Related.** ZPA log streaming's Microsegmentation record is in [What a ZPA Microsegmentation Flow log record says and does not say](kb:zpa.logs.microsegmentation-flow).

What to check:
1. Whether the period asked about is inside the last 14 days these pages filter to.
2. Whether a flow log count above one reflects events combined within the aggregation interval.

Not known (open gaps):
- What the flow log aggregation interval is [gap:zms.analytics:aggregation-interval]: settled by source-read
- What unit Agent CPU Util (%) is in [gap:zms.analytics:telemetry-cpu-unit]: settled by source-read
- Which values Event Logs and Agent Connection Status Logs can take [gap:zms.analytics:values-not-enumerated]: settled by source-read

Area: zms.analytics, its subjects in references/_meta/spine/zms/zms.analytics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.logs.microsegmentation-flow.md (What a ZPA Microsegmentation Flow log record says and does not say)
