# How a session is assigned to an App Connector (zpa.app-connectors.selection)
Also called: which app connector is used; app connector selection; closest app connector; connector affinity 15 minutes; app connector load not balanced; app connector id zero; NO_CONNECTOR_AVAILABLE; wrong app connector
Former IDs: zpa-27

Which connector a session lands on, and what a missing or zero connector in the logs means.

**Selection inputs.** Private Access selects the closest App Connector given the location of the user and the App Connector-to-application latency. [zpa.app-connectors.selection:closest-by-location-and-latency] Because latency to the application is an input, the geographically nearest connector is not necessarily the one selected. [zpa.app-connectors.selection:nearest-is-not-geography-alone] The location set on the App Connector group is used in application path selection. [zpa.app-connectors.selection:group-location-feeds-path-selection] Application segments carry a boolean selectConnectorCloseToApp, documented in the Python SDK as 'Prefer nearest connector routing'. [zpa.app-connectors.selection:segment-prefers-nearest-connector] For Browser Access, the Service Edge sends a request to all App Connectors at the application level, and the connector closest to the internal web application responds by connecting to the Service Edge. [zpa.app-connectors.selection:browser-access-closest-responds] How often latency is measured is open [gap:zpa.app-connectors.selection:latency-probe-cadence].

**Stickiness and balance.** Private Access keeps an active user on the same App Connector for 15 minutes after the user's last request to the application; the timer starts at selection and refreshes on each request. [zpa.app-connectors.selection:affinity-15-minutes] If a connector's load exceeds 70% and the load difference between connectors is greater than 20%, the system might reevaluate affinity and shift traffic to a different connector. [zpa.app-connectors.selection:affinity-rebalance] Load (interface statistics) is not always split equally between connectors in a group; the Health Dashboard shows how applications are split between them over a period. [zpa.app-connectors.selection:uneven-load-expected]

**When no connector is shown.** Logs and diagnostics show the App Connector ID as zero when the Central Authority cannot determine the application or resolve the connection to a connector; this occurs for the session status codes APP_NOT_REACHABLE, INVALID_DOMAIN and NO_CONNECTOR_AVAILABLE. [zpa.app-connectors.selection:connector-id-zero] Reading a closed session by connector assignment is unsourced [gap:zpa.app-connectors.selection:close-with-connector-failure-table].

**Eligibility.** The eligibility rules and the effect of turning the segment setting off are not sourced [gap:zpa.app-connectors.selection:eligibility-filter] [gap:zpa.app-connectors.selection:round-robin-setting].

Connection state and target counts that bear on a connector are in [App Connector health, status values and telemetry](kb:zpa.app-connectors.health); the segment-to-group chain is in [App Connector groups](kb:zpa.app-connectors.connector-groups).

What to check:
1. The user's location, the connector's group location and the connector-to-application latency, rather than distance alone.
2. Whether the user's last request to the application was within 15 minutes, which pins them to the same connector.
3. Whether the application segment has selectConnectorCloseToApp set.
4. Which session status code accompanies a zero connector ID before assuming no connector qualified.
5. Whether the connector load imbalance is within what the help calls expected.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.app-connectors.selection:nearest-is-not-geography-alone] Tier B: Inference from the two named inputs; no source gives a case of a farther connector being chosen.

Not known (open gaps):
- Latency measurement cadence [gap:zpa.app-connectors.selection:latency-probe-cadence]: settled by support-ticket or lab-test
- Eligibility filter before latency selection [gap:zpa.app-connectors.selection:eligibility-filter]: settled by lab-test or support-ticket
- Effect of selectConnectorCloseToApp = false [gap:zpa.app-connectors.selection:round-robin-setting]: settled by lab-test or support-ticket
- Reading a closed session by whether a connector was assigned [gap:zpa.app-connectors.selection:close-with-connector-failure-table]: settled by lab-test or tenant-data

Area: zpa.app-connectors, its subjects in references/_meta/spine/zpa/zpa.app-connectors.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups): The location set on the App Connector group is used in application path selection. [zpa.app-connectors.selection:group-location-feeds-path-selection]
- depends-on references/_meta/text/zpa/zpa.app-connectors.provisioning-keys.md (App Connector provisioning keys), from zpa.app-connectors: A provisioning key is a text string that enrolls an App Connector; it works as the connector's credential, letting the Private Access cloud verify the connector and complete deployment. [zpa.app-connectors.provisioning-keys:key-enrolls-connector]
- interacts-with references/_meta/text/zpa/zpa.app-segments.multimatch-requirements.md (Multimatch prerequisites, restrictions and App Connector selection): Multimatch needs App Connectors or Private Service Edges at version 24.298.1 or later and Zscaler Client Connector at Windows 4.7.0.88 or 4.6.0.282 or later, macOS 4.5.2.98, iOS 4.4.1, Android 3.10 or Linux 4.2 or later; iOS also needs the 'Use Tunnel SDK Version 4.3 or above' setting. [zpa.app-segments.multimatch-requirements:prereq-versions]
- decided-by references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring): Application segments carry a boolean selectConnectorCloseToApp, documented in the Python SDK as 'Prefer nearest connector routing'. [zpa.app-connectors.selection:segment-prefers-nearest-connector]
- logged-in references/_meta/text/zpa/zpa.logs.app-connector-metrics.md (What the ZPA App Connector Metrics log reports and what it leaves open), from zpa.app-connectors: The App Connector Metrics log reports TargetCount, the targets configured for access via the connector, and AliveTargetCount, the targets alive for access via it. [zpa.app-connectors.health:metrics-target-counts]
- logged-in references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers), from zpa.app-connectors: The App Connector Status log's SessionType is ZPN_ASSISTANT_BROKER_CONTROL, the session from the connector to the closest Public Service Edge, and SessionStatus is one of ZPN_STATUS_AUTHENTICATED, ZPN_STATUS_AUTH_FAILED or ZPN_STATUS_DISCONNECTED. [zpa.app-connectors.health:status-log-control-session]
- logged-in references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say): A field named Connector, described as the App Connector name, appears in the User Activity, App Connector Status and App Connector Metrics logs. [zpa.logs.user-activity:connector-name-three-logs]
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/app-connectors.md (config type)
- configured-via references/_meta/text/types/zpa/app-connector-groups.md (config type)
- configured-via references/_meta/text/types/zpa/application-segments.md (config type)
- see-also references/_meta/text/zpa/zpa.app-connectors.deployment.md (App Connector deployment, redundancy and limits)
