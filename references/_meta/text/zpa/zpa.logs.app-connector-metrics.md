# What the ZPA App Connector Metrics log reports and what it leaves open (zpa.logs.app-connector-metrics)
Also called: zpn_ast_comprehensive_stats record; app connector metrics log; AliveTargetCount TargetCount; AppConnectionsActive; AvailablePorts file descriptors; connector overloaded cpu; connector metrics interval

The App Connector Metrics log is per-connector resource and connection telemetry. Its descriptions give the counts but not the intervals or the failure thresholds.

**Recurrence.** The App Connector Metrics example is stamped at 10:40:00, a whole 5-minute mark, and its CPUUtilization field is the maximum CPU usage in the past 5 minutes. [zpa.logs.app-connector-metrics:five-minute-stamp] Whether the interval is 5 minutes, configurable, and whether counters are deltas is open [gap:zpa.logs.app-connector-metrics:interval-and-delta].

**CPU and memory.** App Connector Metrics CPUUtilization is the maximum CPU usage in the past 5 minutes, so it reports a peak; SystemMemoryUtilization is the memory use of the entire VM and ProcessMemoryUtilization that of the App Connector process. [zpa.logs.app-connector-metrics:cpu-peak-window]

**Connections and throughput.** AppConnectionsCreated, AppConnectionsCleared and AppConnectionsActive are described as the numbers of created, cleared and active application Microtunnel connections, with no interval or since-start qualifier; the example shows 300 created, 300 cleared and 0 active. [zpa.logs.app-connector-metrics:app-connection-counts] The four throughput fields are described as the number of bytes transmitted to, or received from, the Public or Private Service Edge, with no interval stated. [zpa.logs.app-connector-metrics:throughput-bytes] What disconnected M-Tunnels imply is open [gap:zpa.logs.app-connector-metrics:disconnected-mtunnel-reading]. The target and M-Tunnel counts are in [App Connector health, status values and telemetry](kb:zpa.app-connectors.health).

**Headroom.** AvailablePorts is the number of usable ports; the file descriptor fields give the total and used counts for the App Connector system and for the App Connector process separately; AvailableDiskBytes is the number of free bytes available for an App Connector. [zpa.logs.app-connector-metrics:headroom-fields] What happens as these run out is open [gap:zpa.logs.app-connector-metrics:exhaustion-effects], as is reading load [gap:zpa.logs.app-connector-metrics:overload-reading].

**Services and joins.** In the Metrics log ServiceCount is the number of services configured for access via the App Connector, whereas in the Status log it is the number of services being monitored. [zpa.logs.app-connector-metrics:service-count-configured] Whether the Connector value joins across logs is open [gap:zpa.logs.app-connector-metrics:connector-join-value].

What to check:
1. Whether a CPU reading was taken as a peak over 5 minutes, not as an average.
2. Whether a rate was computed from the byte or connection counters only after confirming they are per-interval.
3. Whether the target counts show unreachable targets, using the health subject's definitions.

Not known (open gaps):
- Emission interval of App Connector Metrics and whether the counters are deltas [gap:zpa.logs.app-connector-metrics:interval-and-delta]: settled by tenant-data or lab-test. Blocks: computing rates from the byte and connection counters
- What non-zero DisconnectedConnections counts imply [gap:zpa.logs.app-connector-metrics:disconnected-mtunnel-reading]: settled by lab-test or tenant-data. Blocks: deciding whether a connector's disconnected M-Tunnels explain user access failures
- What happens as ports, file descriptors or disk run out [gap:zpa.logs.app-connector-metrics:exhaustion-effects]: settled by lab-test or support-ticket. Blocks: judging when a connector is near failure
- Reading CPU, connection count and target counts as overload or load imbalance [gap:zpa.logs.app-connector-metrics:overload-reading]: settled by lab-test. Blocks: deciding that a connector is overloaded or that targets are unreachable from its network position
- Whether the Connector value is the same name across the Metrics, Status and User Activity logs [gap:zpa.logs.app-connector-metrics:connector-join-value]: settled by tenant-data. Blocks: joining connector records across the three logs

Area: zpa.logs, its subjects in references/_meta/spine/zpa/zpa.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- see-also references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers)
- see-also references/_meta/text/zpa/zpa.logs.service-edge-metrics.md (Private Service Edge and Private Cloud Controller Metrics logs)
- see-also references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
