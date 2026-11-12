# Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades (cloud-connector.logs.event-records)
Also called: cloud connector event log; branch connector event log; zia_tunnel event; zia_gateway event; inst_health_check degraded; upgrade_end fail; cloud connector status change alert

Event logs are the connector's record of its own state changes. They are the streamed signal for tunnel, gateway, health-check and upgrade transitions.

**When one is written.** A Cloud or Branch Connector generates an Event log when a status change occurs for a connector health check, Zscaler data center reachability, a data plane health check, a software upgrade, a control plane health check, or a tunnel to Zscaler data centers. [cloud-connector.logs.event-records:when-generated] Each Event log carries date and time, metadata and nine event-specific attributes (four attribute type and value pairs and an error code), whose values depend on the event type and severity. [cloud-connector.logs.event-records:attributes]

**Event types.** The article's list of all possible Event Type/Severity combinations is ZIA_TUNNEL Info and Error; ZIA_GATEWAY Warn (twice), Error and Info; SVC_HEALTH_CHECK Info and Error; INST_HEALTH_CHECK Warn and Info; CONTROL_PLANE Info and Error; DATA_PLANE Info and Error; UPGRADE_START Info; and UPGRADE_END Info and Error. [cloud-connector.logs.event-records:event-combinations] The names in that list and the example values of the event-name field are spelled differently [divergence:cloud-connector.logs.event-records:event-name-spellings].

**Reading specific events.** ZIA_GATEWAY Warn events record a switch between the primary and secondary gateway (previous state Secondary and current Primary, or the reverse), with the gateway name; ZIA_GATEWAY Error records a change from Active to Inactive. [cloud-connector.logs.event-records:gateway-switch] INST_HEALTH_CHECK Warn records a change from Active to Degraded with the number of active instances and the total instances; INST_HEALTH_CHECK Info records the return from Degraded to Active. [cloud-connector.logs.event-records:instance-degraded] UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name. [cloud-connector.logs.event-records:upgrade-events]

What to check:
1. Which spelling of the event name the SIEM actually receives, from a sample record, before writing a filter on it.
2. Whether an upgrade alert keys on UPGRADE_END with severity Error, which carries the Fail status.

Sources disagree (name both sides):
- The event names in the Event Type/Severity list differ from the example values given for the event-name field in the same article. [divergence:cloud-connector.logs.event-records:event-name-spellings]
  - zscaler-help: The combination list names the events ZIA_TUNNEL, ZIA_GATEWAY, SVC_HEALTH_CHECK, INST_HEALTH_CHECK, CONTROL_PLANE, DATA_PLANE, UPGRADE_START and UPGRADE_END.
  - zscaler-help: The field table gives the event-name examples as VM_HEALTH, ZIA_TUNNEL, ZIA_GW, SVC_HEALTH_CHK, INST_HEALTH_CHK, CTL_PLANE, DATA_PLANE, UPGRADE_ST and UPGRADE_END (rendered run together), including a VM_HEALTH value the list does not have.
  Impact: A SIEM filter or alert written against one spelling may never match the records the feed sends.

Area: cloud-connector.logs, its subjects in references/_meta/spine/cloud-connector/cloud-connector.logs.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/cloud-connector/cloud-connector.forwarding.log-and-control.md (Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud), from cloud-connector.logs: The policy configures the primary and secondary gateways used to set up control channels and forward logs. [cloud-connector.forwarding.log-and-control:gateways]
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM), from cloud-connector.logs: Both Cloud Connector and Branch Connector can generate Session, DNS, Event and Metrics logs, and an NSS feed specifies which log data the NSS sends to the SIEM. [cloud-connector.nss-va:log-types]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.alerting.md (Alerting on Cloud Connector health: event and metrics feeds and console checks)
- see-also references/_meta/text/cloud-connector/cloud-connector.upgrades.monitoring.md (Watching Cloud Connector upgrades: VM record fields, upgrade metrics and upgrade events)
