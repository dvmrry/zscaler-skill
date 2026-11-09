# Private Service Edge and Private Cloud Controller Metrics logs (zpa.logs.service-edge-metrics)
Also called: private service edge metrics log; private cloud controller metrics log; LogTimeStamp capital S; PrivateSE field; zpn_pbroker_comprehensive_stats record; pse resource metrics

The Private Service Edge and Private Cloud Controller Metrics logs are node resource telemetry parallel to the App Connector Metrics log. The Private Service Edge sample has several defects.

**Window and cadence.** In Private Service Edge and Private Cloud Controller Metrics logs CPUUtilization is the maximum CPU usage in the past 5 minutes. [zpa.logs.service-edge-metrics:cpu-peak-window] The Private Cloud Controller Metrics example is stamped 17:25:00 and the Private Service Edge example 11:40:00, both whole 5-minute marks. [zpa.logs.service-edge-metrics:five-minute-stamp] The emission interval is open [gap:zpa.logs.service-edge-metrics:interval-and-delta].

**Field names.** The Private Service Edge timestamp field is spelled differently in its table than in its example and default template [divergence:zpa.logs.service-edge-metrics:log-timestamp-case]. The Private Service Edge name is PrivateSE in the Metrics log and ServiceEdge in the Status log, while the Private Cloud Controller name is PrivateCloudController in both. [zpa.logs.service-edge-metrics:entity-name-fields]

**Sample defects.** The Private Service Edge Metrics example is not valid JSON: the LogTimestamp value is missing its closing quote and SystemMemoryUtilization and ProcessMemoryUtilization hold unsubstituted %j{...} placeholders. [zpa.logs.service-edge-metrics:pse-sample-malformed] The Private Service Edge Metrics example ends with MicroTenantID, while the Private Cloud Controller Metrics example ends at AvailableDiskBytes with no MicroTenantID, and the Service Edge Metric (zpn_pbroker_comprehensive_stats) JSON format in the LSS API article's example response for all log formats also ends at AvailableDiskBytes. [zpa.logs.service-edge-metrics:microtenant-id-sample]

**Alerting.** Resource-pressure thresholds are not sourced [gap:zpa.logs.service-edge-metrics:resource-thresholds].

What to check:
1. Whether a Private Service Edge custom template uses LogTimestamp, as the example and the default template do, rather than the table spelling LogTimeStamp.
2. Whether joins between Private Service Edge status and metrics records use ServiceEdge on one side and PrivateSE on the other.

Sources disagree (name both sides):
- The Private Service Edge Metrics timestamp field name in the table versus the example and the default template [divergence:zpa.logs.service-edge-metrics:log-timestamp-case]
  - zscaler-help: The field table names the timestamp field LogTimeStamp, with a capital S.
  - zscaler-help: The example record names it LogTimestamp.
  - zscaler-help: The default Service Edge Metric template writes LogTimestamp ([[zpa/private-service-edge-metrics-log]]).
  Impact: Field names are case sensitive. The table spells it LogTimeStamp; the example and the default template write LogTimestamp. A custom template built from the table spelling may not emit the field; use LogTimestamp and check a real record.

Not known (open gaps):
- Emission interval of Private Service Edge and Private Cloud Controller Metrics [gap:zpa.logs.service-edge-metrics:interval-and-delta]: settled by tenant-data or lab-test. Blocks: treating these as periodic samples at a known cadence
- Thresholds for Private Service Edge and Private Cloud Controller resource pressure [gap:zpa.logs.service-edge-metrics:resource-thresholds]: settled by lab-test or support-ticket. Blocks: alerting on port, file descriptor or disk pressure for these nodes

Area: zpa.logs, its subjects in references/_meta/spine/zpa/zpa.logs.json
